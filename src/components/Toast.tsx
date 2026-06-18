import { useRef, useCallback, createContext, useContext, ReactNode, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, Info, TriangleAlert as AlertTriangle } from 'lucide-react-native';

type ToastType = 'success' | 'info' | 'error';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const show = useCallback((message: string, type: ToastType = 'info') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState({ visible: true, message, type });

    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 3 seconds
    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setState((prev) => ({ ...prev, visible: false }));
      });
    }, 3000);
  }, [translateY, opacity]);

  const getStyle = () => {
    switch (state.type) {
      case 'success':
        return [styles.toast, styles.successToast];
      case 'error':
        return [styles.toast, styles.errorToast];
      default:
        return [styles.toast, styles.infoToast];
    }
  };

  const getIcon = () => {
    switch (state.type) {
      case 'success':
        return <Check size={18} color="#22c55e" />;
      case 'error':
        return <AlertTriangle size={18} color="#ef4444" />;
      default:
        return <Info size={18} color="#86efac" />;
    }
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {state.visible && (
        <Animated.View
          style={[
            ...getStyle(),
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          {getIcon()}
          <Text style={styles.text}>{state.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    zIndex: 999,
    borderWidth: 1,
  },
  successToast: {
    backgroundColor: '#052e16',
    borderColor: '#22c55e',
  },
  infoToast: {
    backgroundColor: '#1a3a28',
    borderColor: '#166534',
  },
  errorToast: {
    backgroundColor: '#3f0f0f',
    borderColor: '#ef4444',
  },
  text: {
    color: '#f0fdf4',
    fontSize: 14,
    flex: 1,
  },
});
