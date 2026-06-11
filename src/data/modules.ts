export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: string;
  source: string;
  questions: QuizQuestion[];
}

export const modules: Module[] = [
  {
    id: 1,
    title: "What is Climate Change?",
    description: "Understand the basics of climate change, greenhouse gases, and global warming.",
    icon: "🌍",
    source: "NASA, IPCC (2021)",
    content: `**1. Defining Climate vs. Weather**
Weather is what you experience day-to-day — a rainy afternoon, a cool morning, a heatwave. Climate is the long-term pattern of weather averaged over decades (typically 30 years or more) for a given region. When scientists talk about "climate change", they are describing measurable, statistically significant shifts in those long-term patterns: rising averages, more frequent extremes, and changing seasonal rhythms.

**2. The Greenhouse Effect — In Detail**
Sunlight reaches Earth as short-wavelength radiation. The surface absorbs it and re-emits energy as longer-wavelength infrared (heat) radiation. Certain gases in the atmosphere — carbon dioxide (CO₂), methane (CH₄), nitrous oxide (N₂O), water vapour, and fluorinated gases — have molecular structures that absorb this outgoing infrared and re-radiate it in all directions, including back to the surface. This natural process keeps Earth's average temperature around 15°C instead of a frozen -18°C. The problem today is that we have intensified it.

**3. The Industrial Fingerprint**
Ice cores from Antarctica preserve tiny bubbles of ancient air going back 800,000 years. They show atmospheric CO₂ oscillated between about 180 ppm (ice ages) and 280 ppm (warm periods). Since the Industrial Revolution (~1750), CO₂ has surged past 420 ppm — higher than at any point in human evolutionary history. Crucially, isotopic analysis (the ratio of carbon-12 to carbon-13) proves this extra CO₂ comes from fossil fuels, not volcanoes or oceans. This is called the "Suess effect" and it is the smoking gun of human causation.

**4. How 1.1°C Becomes Catastrophic**
Global averages hide regional extremes. Arctic regions have warmed nearly 4× faster than the global mean. A 1.1°C rise in the average means many more days above 35°C, longer fire seasons, heavier rainfall events (warmer air holds ~7% more moisture per °C), stronger hurricanes, and shifted growing seasons. Climate is a non-linear system: small pushes can trigger disproportionate responses.

**5. Observed Impacts Today**
• Greenland is losing ~270 billion tonnes of ice per year.
• Global sea level has risen ~21 cm since 1880 and is accelerating.
• Coral reefs have suffered three global bleaching events since 2014.
• Extreme heat events have become 5× more likely.
• The ocean has absorbed ~30% of human CO₂, becoming 30% more acidic.

**6. Tipping Points and the 1.5°C Limit**
Scientists identify "tipping elements" — systems that could shift abruptly and irreversibly: collapse of the West Antarctic Ice Sheet, dieback of the Amazon rainforest, thawing of Arctic permafrost releasing methane, shutdown of the Atlantic Meridional Overturning Circulation. The 1.5°C target from the Paris Agreement is not arbitrary — it is the threshold beyond which the risk of crossing multiple tipping points rises sharply. Every fraction of a degree matters.`,
    questions: [
      { id: "m1-e1", question: "What is climate change?", options: ["A daily weather pattern", "Long-term shifts in temperatures and weather patterns", "A type of natural disaster", "Seasonal temperature changes"], correctIndex: 1, explanation: "Climate change refers to long-term shifts in temperatures and weather patterns across the globe.", difficulty: "easy" },
      { id: "m1-e2", question: "What is the main greenhouse gas released by burning fossil fuels?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correctIndex: 2, explanation: "Burning fossil fuels primarily releases carbon dioxide (CO₂) into the atmosphere.", difficulty: "easy" },
      { id: "m1-e3", question: "What is the greenhouse effect?", options: ["Plants growing in a greenhouse", "Gases trapping heat in the atmosphere", "The ozone layer blocking UV rays", "Clouds reflecting sunlight"], correctIndex: 1, explanation: "The greenhouse effect is when gases in the atmosphere trap heat from the sun, warming the Earth.", difficulty: "easy" },
      { id: "m1-e4", question: "By how much has global temperature risen above pre-industrial levels?", options: ["0.1°C", "1.1°C", "5°C", "10°C"], correctIndex: 1, explanation: "The global average temperature has risen by approximately 1.1°C above pre-industrial levels.", difficulty: "easy" },
      { id: "m1-e5", question: "Which of these is a greenhouse gas?", options: ["Oxygen", "Nitrogen", "Methane", "Helium"], correctIndex: 2, explanation: "Methane (CH₄) is one of the major greenhouse gases contributing to global warming.", difficulty: "easy" },
      { id: "m1-m1", question: "Why is a 1.1°C rise in global temperature considered significant?", options: ["It only affects polar regions", "Even small changes trigger massive shifts in weather and ecosystems", "It's not actually significant", "It only matters for agriculture"], correctIndex: 1, explanation: "Even tiny changes in global average temperatures can trigger massive shifts in weather systems, sea levels, and ecosystems.", difficulty: "medium" },
      { id: "m1-m2", question: "Since the Industrial Revolution, CO₂ concentration has increased by approximately:", options: ["10%", "25%", "50%", "100%"], correctIndex: 2, explanation: "Since the Industrial Revolution, atmospheric CO₂ concentration has increased by more than 50%.", difficulty: "medium" },
      { id: "m1-m3", question: "What distinguishes current climate change from past natural climate variations?", options: ["It's caused by volcanic activity", "The rate of change is much faster due to human activities", "It only affects ocean temperatures", "Natural cycles are stronger now"], correctIndex: 1, explanation: "Current rapid warming is primarily driven by human activities, unlike slower natural climate variations.", difficulty: "medium" },
      { id: "m1-m4", question: "What temperature threshold do scientists warn could lead to irreversible consequences?", options: ["0.5°C", "1.5°C", "3°C", "5°C"], correctIndex: 1, explanation: "Scientists warn that warming exceeding 1.5°C could have irreversible consequences.", difficulty: "medium" },
      { id: "m1-m5", question: "Which of these is NOT a visible effect of current climate change?", options: ["Melting ice sheets", "Rising sea levels", "Increased oxygen levels", "More extreme weather events"], correctIndex: 2, explanation: "Increased oxygen is not an effect of climate change; melting ice, rising seas, and extreme weather are.", difficulty: "medium" },
      { id: "m1-h1", question: "How does the greenhouse effect create a positive feedback loop with melting ice?", options: ["Melting ice cools the atmosphere", "Less ice means less reflection of sunlight, causing more warming", "Ice melting releases oxygen", "Feedback loops don't exist in climate science"], correctIndex: 1, explanation: "When ice melts, dark ocean/land surfaces absorb more heat instead of reflecting it, accelerating warming.", difficulty: "hard" },
      { id: "m1-h2", question: "Why are developing nations more vulnerable to climate change despite contributing less emissions?", options: ["They have warmer climates naturally", "They lack resources to adapt and depend more on climate-sensitive sectors", "They have more greenhouse gases", "They are closer to the equator only"], correctIndex: 1, explanation: "Developing nations have fewer resources for adaptation and rely heavily on agriculture and natural resources.", difficulty: "hard" },
      { id: "m1-h3", question: "What is the relationship between CO₂ concentration and ocean acidification?", options: ["No relationship exists", "CO₂ absorbed by oceans forms carbonic acid, lowering pH", "CO₂ makes oceans more alkaline", "Only methane affects oceans"], correctIndex: 1, explanation: "Oceans absorb CO₂ which forms carbonic acid, lowering ocean pH and threatening marine ecosystems.", difficulty: "hard" },
      { id: "m1-h4", question: "Why is methane considered more potent than CO₂ despite being less abundant?", options: ["It lasts longer in the atmosphere", "It traps significantly more heat per molecule over a 20-year period", "It's not actually more potent", "It only affects the stratosphere"], correctIndex: 1, explanation: "Methane traps about 80 times more heat per molecule than CO₂ over a 20-year period.", difficulty: "hard" },
      { id: "m1-h5", question: "How do tipping points in the climate system differ from gradual changes?", options: ["They are predictable", "They represent thresholds beyond which changes become self-reinforcing and irreversible", "They only affect temperature", "They can always be reversed"], correctIndex: 1, explanation: "Tipping points are critical thresholds where small changes trigger large, self-reinforcing, and potentially irreversible shifts.", difficulty: "hard" },
    ],
  },
  {
    id: 2,
    title: "Causes of Climate Change",
    description: "Explore the human activities and natural factors driving climate change.",
    icon: "🏭",
    source: "IPCC (2021), UNESCO (2022)",
    content: `**1. The Energy System — Root of Modern Emissions**
About 73% of global greenhouse gas emissions come from energy use: electricity generation, heating, transport, and industry. Coal is the most carbon-intensive fuel (~820 g CO₂/kWh), followed by oil (~720 g/kWh) and natural gas (~490 g/kWh). Renewables like solar and wind emit 10–50× less over their lifecycle. In 2022, fossil fuel CO₂ emissions hit ~36.8 Gt — a record. China, the US, India, the EU, and Russia together account for over 60% of annual emissions, though per-capita figures tell a very different story (the average American emits ~14 t, the average Nigerian ~0.7 t).

**2. Transport — A Stubborn Sector**
Transport contributes ~16% of global CO₂. Road vehicles dominate, but aviation (~2.5%) and shipping (~3%) are growing fast and are particularly hard to decarbonise because batteries are too heavy for long-haul flight or ocean freight. Synthetic fuels, hydrogen, and ammonia are being explored as alternatives.

**3. Land Use, Deforestation, and Agriculture**
Land-use change contributes ~11% of emissions, primarily from clearing tropical forests for cattle, soy, palm oil, and timber. The Amazon, Congo, and Southeast Asian rainforests are the three great carbon sinks — and all three are now under severe pressure. Agriculture itself adds another ~12%:
• Enteric fermentation: cows and other ruminants release methane through digestion.
• Manure management and synthetic fertilisers produce nitrous oxide (~265× more potent than CO₂).
• Flooded rice paddies generate methane from anaerobic microbes.
• Land clearance and soil disturbance release stored carbon.

**4. Industry and Materials**
Cement (~8% of global CO₂), steel (~7%), chemicals, and aluminium are emissions-intensive because their chemistry inherently releases CO₂ (cement clinker production) or requires very high heat. "Hard-to-abate" sectors need entirely new processes — green hydrogen-based steel, electrified cement kilns, and carbon capture.

**5. Waste and the Hidden Methane Problem**
Open landfills, especially in fast-urbanising countries, release vast amounts of methane as organic waste decomposes anaerobically. Methane is ~80× more powerful than CO₂ over 20 years, so improved waste management is one of the highest-leverage climate actions available.

**6. Natural Drivers — Why They're Not the Culprit**
Volcanoes, solar variability, and orbital cycles have driven past climate shifts. But measurements are clear: volcanic CO₂ is ~100× smaller than human emissions annually, solar output has actually slightly declined since 1980 while temperatures rose, and Milankovitch cycles operate on tens of thousands of years. The IPCC's Sixth Assessment concluded with 95%+ confidence that humans are the dominant cause of warming since 1950.

**7. Inequality of Responsibility**
The richest 10% of humanity is responsible for ~50% of consumption-based emissions. The poorest 50% account for only ~12%. This asymmetry is at the heart of "climate justice" debates.`,
    questions: [
      { id: "m2-e1", question: "What is the primary driver of modern climate change?", options: ["Volcanic eruptions", "Solar cycles", "Burning fossil fuels", "Deforestation only"], correctIndex: 2, explanation: "Burning fossil fuels for energy, transportation, and industry is the primary driver.", difficulty: "easy" },
      { id: "m2-e2", question: "How does deforestation contribute to climate change?", options: ["Trees produce CO₂", "Removing trees releases stored carbon", "Forests block sunlight", "Deforestation cools the earth"], correctIndex: 1, explanation: "When forests are cleared, the carbon stored in trees is released into the atmosphere.", difficulty: "easy" },
      { id: "m2-e3", question: "Which animal's farming contributes significantly to methane emissions?", options: ["Chickens", "Fish", "Cattle", "Rabbits"], correctIndex: 2, explanation: "Cattle produce methane during digestion, making livestock farming a significant source.", difficulty: "easy" },
      { id: "m2-e4", question: "What percentage of warming is caused by human activities since the mid-20th century?", options: ["50%", "75%", "More than 95%", "100%"], correctIndex: 2, explanation: "Human activities are responsible for more than 95% of observed warming.", difficulty: "easy" },
      { id: "m2-e5", question: "Which fossil fuel is commonly burned in power plants?", options: ["Natural rubber", "Coal", "Sand", "Limestone"], correctIndex: 1, explanation: "Coal-fired power plants are major sources of CO₂ emissions.", difficulty: "easy" },
      { id: "m2-m1", question: "How much CO₂ did fossil fuels emit globally in 2022?", options: ["10 billion tonnes", "20 billion tonnes", "36.8 billion tonnes", "50 billion tonnes"], correctIndex: 2, explanation: "Global CO₂ emissions from fossil fuels reached approximately 36.8 billion tonnes in 2022.", difficulty: "medium" },
      { id: "m2-m2", question: "What percentage of global emissions does tropical deforestation account for?", options: ["About 2%", "About 10%", "About 25%", "About 50%"], correctIndex: 1, explanation: "Tropical deforestation accounts for about 10% of global greenhouse gas emissions.", difficulty: "medium" },
      { id: "m2-m3", question: "How does cement production contribute to climate change?", options: ["It uses wood", "The chemical process releases CO₂", "It absorbs greenhouse gases", "It only uses clean energy"], correctIndex: 1, explanation: "Cement production releases CO₂ through chemical processes and accounts for about 8% of global CO₂ emissions.", difficulty: "medium" },
      { id: "m2-m4", question: "Why do rice paddies contribute to greenhouse gas emissions?", options: ["Rice absorbs sunlight", "Waterlogged soils emit methane", "Rice plants produce CO₂", "Fertilizers evaporate"], correctIndex: 1, explanation: "Rice paddies emit methane from waterlogged soils where organic matter decomposes without oxygen.", difficulty: "medium" },
      { id: "m2-m5", question: "What gas do nitrogen-based fertilizers release?", options: ["Carbon dioxide", "Methane", "Nitrous oxide", "Oxygen"], correctIndex: 2, explanation: "Nitrogen-based fertilizers release nitrous oxide (N₂O), a potent greenhouse gas.", difficulty: "medium" },
      { id: "m2-h1", question: "Why is the argument that 'volcanoes cause more emissions than humans' scientifically incorrect?", options: ["Volcanoes don't emit gases", "Human emissions are roughly 100 times greater than volcanic emissions annually", "Volcanic gases aren't greenhouse gases", "Both contribute equally"], correctIndex: 1, explanation: "Human activities emit roughly 100 times more CO₂ per year than all volcanoes combined.", difficulty: "hard" },
      { id: "m2-h2", question: "How do feedback mechanisms in deforestation amplify climate change beyond direct carbon release?", options: ["They don't amplify it", "Loss of transpiration reduces rainfall, causing further forest dieback", "Trees grow back quickly", "Only tropical forests matter"], correctIndex: 1, explanation: "Deforestation reduces transpiration and rainfall, potentially causing further forest dieback in a feedback loop.", difficulty: "hard" },
      { id: "m2-h3", question: "Why are Scope 3 emissions important when assessing a country's true carbon footprint?", options: ["They only count domestic emissions", "They include embedded emissions in imported goods and supply chains", "They exclude transportation", "They're not recognized by scientists"], correctIndex: 1, explanation: "Scope 3 emissions capture the full lifecycle including imported goods, revealing true consumption-based footprints.", difficulty: "hard" },
      { id: "m2-h4", question: "How does the carbon cycle's natural balance differ from anthropogenic disruption?", options: ["Natural cycles are faster", "Natural processes balanced emissions and absorption until humans added excess CO₂", "Human CO₂ is different chemically", "There's no natural carbon cycle"], correctIndex: 1, explanation: "Natural carbon cycles maintained balance over millennia; human activities have added excess CO₂ faster than natural sinks can absorb.", difficulty: "hard" },
      { id: "m2-h5", question: "Why might reducing methane emissions have a faster impact on short-term warming than reducing CO₂?", options: ["Methane is less abundant", "Methane has a shorter atmospheric lifetime (~12 years) but much higher warming potential", "CO₂ doesn't cause warming", "Methane only comes from natural sources"], correctIndex: 1, explanation: "Methane stays in the atmosphere for ~12 years vs centuries for CO₂, so cutting it yields faster cooling benefits.", difficulty: "hard" },
    ],
  },
  {
    id: 3,
    title: "Effects of Climate Change in Nigeria",
    description: "Discover how climate change specifically impacts Nigerian communities and ecosystems.",
    icon: "🇳🇬",
    source: "Okafor et al. (2022), NEST",
    content: `**1. Why Nigeria is Highly Exposed**
Nigeria sits across multiple climate zones — Sahel in the north, Guinea savanna in the middle, tropical rainforest and mangrove coast in the south. Each is vulnerable in a different way. The country also has weak adaptive infrastructure, a fast-growing population (projected to reach 400 million by 2050), and an economy concentrated in climate-sensitive sectors: agriculture, oil, and informal urban services. The IPCC ranks West Africa among the world's most vulnerable regions.

**2. Desertification and Land Degradation in the North**
The Sahara is advancing southward at roughly 0.6 km per year. In states like Borno, Yobe, Sokoto, Jigawa, Katsina, and Kebbi, Lake Chad — once Africa's fourth-largest lake — has shrunk by ~90% since the 1960s due to drought, over-extraction, and rising temperatures. Roughly 30 million people who depended on it for fishing, farming, and grazing have lost their livelihoods. This collapse is widely cited as a driver of the Boko Haram insurgency, which recruits heavily from displaced and economically devastated communities.

**3. Flooding and the Coastal South**
The 2022 floods affected 34 of 36 states, killed more than 600 people, displaced 1.4 million, and destroyed over 440,000 hectares of farmland. Lagos — home to ~21 million people and worth ~30% of national GDP — is sinking at ~2 mm/year while seas rise at 3 mm/year. Without major adaptation (sea walls, drainage upgrades, mangrove restoration), large parts of Lagos Island, Victoria Island, and Lekki could be regularly inundated by 2050. Niger Delta communities face saltwater intrusion that poisons drinking water and farmland.

**4. Agriculture and Food Security**
Agriculture employs ~70% of rural Nigerians and contributes ~24% of GDP. Climate change is hitting yields hard:
• Erratic rainfall is shortening growing seasons in the Sahel.
• Heat stress reduces maize yields by ~10% per 1°C above 30°C.
• Cocoa belts in Ondo, Cross River, and Ogun are shifting upslope as conditions become too warm.
• Pests and crop diseases (fall armyworm, cassava mosaic virus) are expanding their ranges.
Food prices have risen sharply, and Nigeria — once self-sufficient — now imports billions of dollars in food annually.

**5. Public Health Impacts**
Warmer temperatures expand the range of malaria-carrying *Anopheles* mosquitoes into highland areas of Plateau and Taraba. Cholera outbreaks follow floods. Meningitis belts in the north shift with changing rainfall. Air pollution from generators, biomass cooking, and gas flaring in the Niger Delta compounds respiratory disease. Heat stress is increasingly affecting outdoor workers — farmers, market traders, motorcycle taxi (okada) riders.

**6. Climate, Conflict, and Migration**
Climate stress acts as a *threat multiplier*. The southward push of herders into the Middle Belt has fuelled deadly farmer-herder clashes in Benue, Plateau, Nasarawa, and Taraba — now one of Nigeria's deadliest internal conflicts. Coastal erosion has displaced communities in Bayelsa and Akwa Ibom. Internal climate migration is straining cities like Lagos, Abuja, and Port Harcourt.

**7. The Energy Paradox**
Nigeria is Africa's largest oil producer, yet ~85 million Nigerians lack reliable electricity. Decentralised solar — mini-grids, solar home systems — is rapidly expanding and offers a path to leapfrog dirty grids. The federal Energy Transition Plan targets net-zero by 2060 with massive solar, gas-as-transition-fuel, and reforestation components.`,
    questions: [
      { id: "m3-e1", question: "What is happening to the Sahara Desert in relation to Nigeria?", options: ["It's shrinking", "It's expanding southward", "It's staying the same", "It's moving eastward"], correctIndex: 1, explanation: "The Sahara Desert is expanding southward by approximately 600 metres per year.", difficulty: "easy" },
      { id: "m3-e2", question: "How many people were displaced by Nigeria's 2022 floods?", options: ["10,000", "100,000", "Over 1.4 million", "500,000"], correctIndex: 2, explanation: "The 2022 floods displaced over 1.4 million people in Nigeria.", difficulty: "easy" },
      { id: "m3-e3", question: "What percentage of Nigeria's rural population works in agriculture?", options: ["About 30%", "About 50%", "About 70%", "About 90%"], correctIndex: 2, explanation: "Nigeria's agricultural sector employs about 70% of the rural population.", difficulty: "easy" },
      { id: "m3-e4", question: "Which Nigerian city is threatened by rising sea levels?", options: ["Abuja", "Kano", "Lagos", "Jos"], correctIndex: 2, explanation: "Lagos, a coastal city, is threatened by rising sea levels.", difficulty: "easy" },
      { id: "m3-e5", question: "What disease has spread to new areas in Nigeria due to warming temperatures?", options: ["Diabetes", "Malaria", "Asthma", "Cholera"], correctIndex: 1, explanation: "Temperature increases have expanded the range of malaria-carrying mosquitoes.", difficulty: "easy" },
      { id: "m3-m1", question: "How does desertification in the North connect to the farmer-herder conflict in the Middle Belt?", options: ["It doesn't connect", "Pastoralists move south seeking grazing land, clashing with farmers", "Farmers move north", "The conflict is purely political"], correctIndex: 1, explanation: "Pastoralists are pushed southward by desertification, competing for land with farming communities.", difficulty: "medium" },
      { id: "m3-m2", question: "At what rate is the Sahara Desert expanding southward annually?", options: ["100 metres", "600 metres", "1 kilometre", "5 kilometres"], correctIndex: 1, explanation: "The Sahara is expanding southward by approximately 600 metres per year.", difficulty: "medium" },
      { id: "m3-m3", question: "Why is Lagos particularly vulnerable to sea-level rise?", options: ["It's at high altitude", "Rising seas combined with land subsidence compound the problem", "It has no coastline", "It's too far inland"], correctIndex: 1, explanation: "Lagos faces both rising sea levels and land subsidence, making it doubly vulnerable.", difficulty: "medium" },
      { id: "m3-m4", question: "How do changes in rainfall patterns affect Nigerian farmers?", options: ["They have no effect", "They disrupt planting seasons and reduce crop yields", "They always increase yields", "Only cash crops are affected"], correctIndex: 1, explanation: "Disrupted rainfall patterns affect planting seasons, reduce yields, and threaten food security.", difficulty: "medium" },
      { id: "m3-m5", question: "Which Nigerian states have lost significant agricultural land to desertification?", options: ["Lagos, Ogun, Oyo", "Borno, Yobe, Sokoto", "Rivers, Bayelsa, Delta", "Enugu, Anambra, Imo"], correctIndex: 1, explanation: "Northern states like Borno, Yobe, and Sokoto have lost significant agricultural land.", difficulty: "medium" },
      { id: "m3-h1", question: "How does climate change act as a 'threat multiplier' for Nigeria's security challenges?", options: ["It directly causes wars", "It intensifies existing resource competition, displacement, and social tensions", "It has no security implications", "It only affects the military"], correctIndex: 1, explanation: "Climate change amplifies existing vulnerabilities by worsening resource scarcity, displacement, and competition.", difficulty: "hard" },
      { id: "m3-h2", question: "Why is Nigeria's dependence on oil revenue a climate vulnerability in itself?", options: ["Oil is climate-resistant", "Global transition away from fossil fuels threatens Nigeria's main revenue source", "Oil prices always increase", "Nigeria has diversified its economy"], correctIndex: 1, explanation: "As the world transitions to clean energy, Nigeria's oil-dependent economy faces declining revenue.", difficulty: "hard" },
      { id: "m3-h3", question: "How does urban heat island effect compound climate change impacts in Nigerian cities?", options: ["Cities are always cooler", "Concrete and lack of vegetation amplify heat, increasing health risks and energy demand", "Urban areas are unaffected", "Only rural areas experience heat"], correctIndex: 1, explanation: "Dense urban areas with concrete surfaces absorb and retain more heat, intensifying warming effects.", difficulty: "hard" },
      { id: "m3-h4", question: "What is the concept of 'climate justice' in the context of Nigeria's emissions vs. vulnerability?", options: ["All countries are equally responsible", "Nigeria contributes minimally to emissions but bears disproportionate consequences", "Climate justice is irrelevant", "Only wealthy nations are affected"], correctIndex: 1, explanation: "Nigeria contributes very little to global emissions but suffers disproportionately from climate impacts.", difficulty: "hard" },
      { id: "m3-h5", question: "How might climate-induced migration from northern Nigeria create cascading socio-economic challenges?", options: ["Migration has no effects", "Mass displacement strains urban infrastructure, jobs, healthcare, and can fuel ethnic tensions", "People adapt immediately", "Southern states have unlimited capacity"], correctIndex: 1, explanation: "Large-scale climate migration creates pressure on urban services, employment, and social cohesion.", difficulty: "hard" },
    ],
  },
  {
    id: 4,
    title: "What Individuals Can Do",
    description: "Learn practical actions everyone can take to combat climate change.",
    icon: "🌱",
    source: "UNESCO (2022), NASA",
    content: `**1. Why Individual Action Matters (and Where It Doesn't)**
Roughly 70% of global emissions trace back to just 100 fossil-fuel companies, so personal choices alone will not solve the crisis. But individuals shape demand, politics, and culture. The most impactful "personal" actions are usually the ones that scale: voting, advocacy, professional career choices, and influencing peers — not just turning off lights.

**2. Home Energy — Highest Leverage Per Naira**
• Switch all incandescent bulbs to LEDs (use up to 90% less power).
• Unplug "vampire" devices (TVs, chargers, decoders) — they draw 5–10% of home electricity even when "off".
• Set air conditioners to 24–25°C; every 1°C lower roughly increases consumption by ~7%.
• Insulate roofs and use light-coloured paint to reduce cooling load.
• If you can invest, rooftop solar pays back in 4–7 years in most Nigerian cities and frees you from generator fuel.

**3. Transport**
Per passenger-kilometre, walking and cycling emit zero; a danfo or BRT bus emits ~30–80 g CO₂; a private car emits ~150–250 g; a short-haul flight emits ~250 g. Practical steps:
• Combine errands into one trip.
• Use BRT and shared transport for daily commutes.
• Keep tyres correctly inflated (improves fuel economy ~3%).
• When buying a vehicle, prioritise fuel efficiency or hybrid/electric where charging is feasible.

**4. Food and Water**
• Beef and lamb are 10–50× more emissions-intensive than legumes, grains, and vegetables. Swapping a few meals per week to plant-based meals (beans, moi-moi, vegetable stews) is one of the highest-impact dietary changes.
• Reduce food waste — globally ~30% of food is wasted; in Nigeria post-harvest losses are particularly high. Plan meals, store properly, compost scraps.
• Eat seasonally and locally where possible to cut transport emissions.

**5. Waste and Consumption**
• Refuse single-use plastics — sachet water, plastic cutlery, straws. Carry a reusable bottle and bag.
• Repair before replacing — clothes, electronics, phones.
• Buy second-hand (Nigeria's "okrika" markets are already great at this).
• Sort waste at source; support local recycling co-ops.

**6. Trees, Land, and Nature**
Mature trees absorb ~20–25 kg of CO₂ per year. Community greening — school gardens, urban tree planting, mangrove restoration in the Niger Delta — also cools cities, reduces flood risk, and improves air quality. Avoid burning bush or charcoal where alternatives exist.

**7. The Multiplier Actions — Where Real Power Lives**
These are usually skipped in "10 tips" articles but matter most:
• **Talk about climate.** Studies show peer conversations shift behaviour more than data sheets.
• **Vote and engage politically** — for candidates with credible climate plans.
• **Move money.** Choose banks and pensions that don't finance fossil expansion.
• **Career choice.** Working on clean energy, sustainable agriculture, climate policy, or green tech can be your biggest lifetime contribution.
• **Hold corporations accountable.** Call out greenwashing; demand transparency.

**8. Watch Out For Greenwashing**
Companies routinely market products as "eco-friendly", "carbon-neutral", or "natural" without substance. Look for verifiable certifications, full-lifecycle disclosures, and independent audits — not just green colour schemes and leaf logos.`,
    questions: [
      { id: "m4-e1", question: "What type of light bulb is most energy-efficient?", options: ["Incandescent", "Halogen", "LED", "Fluorescent"], correctIndex: 2, explanation: "LED bulbs are the most energy-efficient lighting option.", difficulty: "easy" },
      { id: "m4-e2", question: "What does 'reduce, reuse, recycle' help prevent?", options: ["Deforestation", "Methane emissions from landfills", "Solar radiation", "Ocean currents"], correctIndex: 1, explanation: "Reducing, reusing, and recycling waste helps lower methane emissions from landfills.", difficulty: "easy" },
      { id: "m4-e3", question: "Which dietary change can reduce your carbon footprint?", options: ["Eating more red meat", "Eating more plant-based foods", "Eating more imported food", "No dietary change matters"], correctIndex: 1, explanation: "Eating more plant-based foods reduces your carbon footprint since livestock farming produces significant emissions.", difficulty: "easy" },
      { id: "m4-e4", question: "What is a simple way to reduce transport emissions?", options: ["Drive alone more", "Buy a bigger car", "Use public transport or carpool", "Fly more often"], correctIndex: 2, explanation: "Using public transport or carpooling reduces per-person emissions compared to driving alone.", difficulty: "easy" },
      { id: "m4-e5", question: "How do trees help fight climate change?", options: ["They produce CO₂", "They absorb CO₂ from the atmosphere", "They have no effect", "They only provide shade"], correctIndex: 1, explanation: "Trees absorb CO₂ during photosynthesis, helping remove greenhouse gases from the atmosphere.", difficulty: "easy" },
      { id: "m4-m1", question: "Why is energy conservation particularly important in Nigeria?", options: ["Nigeria has excess power", "Electricity generation relies heavily on fossil fuels and generators", "Energy is free in Nigeria", "Nigeria uses only renewable energy"], correctIndex: 1, explanation: "Nigeria's heavy reliance on fossil fuels and generators means every kilowatt saved reduces emissions.", difficulty: "medium" },
      { id: "m4-m2", question: "What is the most powerful individual climate action mentioned?", options: ["Buying an electric car", "Spreading awareness and advocacy", "Moving to a rural area", "Avoiding all technology"], correctIndex: 1, explanation: "Advocacy and education amplify impact far beyond personal actions by influencing others.", difficulty: "medium" },
      { id: "m4-m3", question: "How can composting help reduce climate change?", options: ["It produces energy", "It prevents organic waste from producing methane in landfills", "It creates more waste", "Composting has no climate benefit"], correctIndex: 1, explanation: "Composting prevents organic waste from decomposing anaerobically in landfills, where it would produce methane.", difficulty: "medium" },
      { id: "m4-m4", question: "Why is choosing trains over flights recommended for long distances?", options: ["Trains are always faster", "Trains produce significantly less CO₂ per passenger-kilometre", "Flights are safer", "There's no difference"], correctIndex: 1, explanation: "Trains produce far less CO₂ per passenger-kilometre compared to air travel.", difficulty: "medium" },
      { id: "m4-m5", question: "How do individual actions 'add up' to meaningful impact?", options: ["They don't matter at all", "Millions of people making small changes creates collective large-scale reduction", "Only government action matters", "Individual impact can't be measured"], correctIndex: 1, explanation: "When millions of individuals make small changes, the collective impact becomes significant.", difficulty: "medium" },
      { id: "m4-h1", question: "Why might systemic change be more impactful than individual behaviour change alone?", options: ["Individual actions don't matter", "Systemic policies can shift entire industries and infrastructure, affecting millions simultaneously", "Systems can't be changed", "Individual action is always sufficient"], correctIndex: 1, explanation: "Policy and systemic changes affect entire populations and industries, achieving scale impossible through individual action alone.", difficulty: "hard" },
      { id: "m4-h2", question: "How does the concept of a 'carbon footprint' potentially mislead people about climate responsibility?", options: ["It's always accurate", "It was popularized by oil companies to shift blame from corporations to individuals", "Individuals are solely responsible", "Carbon footprints can't be measured"], correctIndex: 1, explanation: "The term was promoted by fossil fuel companies to deflect attention from corporate and systemic responsibility.", difficulty: "hard" },
      { id: "m4-h3", question: "What is 'greenwashing' and why is it relevant to individual climate action?", options: ["Washing clothes in eco-friendly soap", "Companies falsely marketing products as eco-friendly, misleading consumer choices", "A type of renewable energy", "Government environmental policy"], correctIndex: 1, explanation: "Greenwashing misleads consumers into thinking their purchases are sustainable when they may not be.", difficulty: "hard" },
      { id: "m4-h4", question: "How does the 'rebound effect' potentially undermine energy efficiency gains?", options: ["Efficiency always helps", "Savings from efficiency may lead to increased consumption, offsetting gains", "There is no rebound effect", "It only applies to transportation"], correctIndex: 1, explanation: "When efficiency lowers costs, people may use more energy overall, partially negating the efficiency benefits.", difficulty: "hard" },
      { id: "m4-h5", question: "Why is climate education itself considered a form of climate action?", options: ["Education has no practical impact", "Informed citizens make better choices, support policies, and hold leaders accountable", "Only scientists need climate education", "Education only helps in developed countries"], correctIndex: 1, explanation: "Education creates informed citizens who drive both individual and systemic change through choices and advocacy.", difficulty: "hard" },
    ],
  },
  {
    id: 5,
    title: "Climate Action and the SDGs",
    description: "Understand how climate action connects to the UN Sustainable Development Goals.",
    icon: "🎯",
    source: "UNESCO (2022), UN SDG Reports",
    content: `**1. The 2030 Agenda**
In 2015, all 193 UN member states adopted the *2030 Agenda for Sustainable Development*: 17 Sustainable Development Goals (SDGs) and 169 targets covering poverty, hunger, health, education, gender equality, water, energy, jobs, inequality, cities, consumption, oceans, land, peace, and partnerships. The SDGs are *indivisible* — progress on one depends on progress on others.

**2. SDG 13: Climate Action — The Targets**
SDG 13 has five specific targets:
13.1 Strengthen resilience and adaptive capacity to climate hazards and natural disasters.
13.2 Integrate climate measures into national policies, strategies, and planning.
13.3 Improve education, awareness, and human/institutional capacity on mitigation and early warning.
13.a Implement the UNFCCC commitment to mobilise US$100 billion/year to support developing countries.
13.b Promote effective climate planning in least-developed and small island states, with a focus on women, youth, and marginalised communities.

**3. The Web of Connections**
• **SDG 1 (No Poverty):** A single climate disaster can push families into multi-generational poverty.
• **SDG 2 (Zero Hunger):** Yields of staple crops (maize, wheat, rice) fall ~5–10% per 1°C of warming.
• **SDG 3 (Good Health):** WHO estimates climate change will cause ~250,000 extra deaths/year between 2030–2050 from heat, malnutrition, malaria, and diarrhoea.
• **SDG 5 (Gender Equality):** Women in low-income communities — who often manage water, food, and energy — face disproportionate climate burdens.
• **SDG 6 (Clean Water):** Droughts and floods threaten freshwater supplies.
• **SDG 7 (Affordable & Clean Energy):** The energy transition is the spine of climate mitigation.
• **SDG 11 (Sustainable Cities):** ~70% of emissions and most climate risk concentrates in urban areas.
• **SDG 14 & 15 (Life Below Water / On Land):** Ocean acidification, coral bleaching, and ecosystem collapse are direct climate consequences.

**4. The Paris Agreement — How It Works**
Adopted at COP21 in 2015 and entered into force in 2016, the Paris Agreement is legally binding in process (every country must submit and update a plan) but voluntary in ambition. Each country files a **Nationally Determined Contribution (NDC)** — its self-set emissions and adaptation targets — and updates it every 5 years in a "ratchet mechanism" intended to increase ambition over time. A global stocktake every 5 years assesses collective progress.

The agreement's goal: limit warming to *well below 2°C*, pursuing efforts toward *1.5°C*. Current NDCs are projected to deliver only ~2.5–2.9°C of warming — a serious ambition gap.

**5. Nigeria's Climate Commitments**
• **NDC (2021 update):** 20% unconditional emissions reduction by 2030, 47% conditional on international support, relative to business-as-usual.
• **Net-zero by 2060** (announced at COP26).
• **Climate Change Act (2021):** establishes a National Council on Climate Change and carbon budgets.
• **Energy Transition Plan (2022):** identifies US$1.9 trillion of investment needed by 2060; emphasises gas as a transition fuel, massive solar deployment, clean cooking, electric mobility, and reforestation.

**6. Climate Finance and Justice**
Wealthy nations promised US$100 billion/year by 2020 to help developing countries adapt and decarbonise — a target only barely met in 2022, and largely as loans rather than grants. The COP27 "Loss and Damage" fund (2022) is a historic acknowledgement that countries least responsible for emissions deserve compensation for unavoidable losses. The COP28 outcome (2023) for the first time called for "transitioning away from fossil fuels" — symbolic but not binding.

**7. Why Youth Voice Matters**
Decisions made now will define the climate that young people inherit. Youth-led movements — Fridays For Future, the Africa Youth Climate Hub, Nigeria's Eco-Warriors and Climate Action Africa — are reshaping politics. Climate education, civic engagement, and platforms like ECOLARA are critical for building informed, mobilised generations who will hold leaders accountable through 2030, 2050, and beyond.`,
    questions: [
      { id: "m5-e1", question: "What number SDG is Climate Action?", options: ["SDG 7", "SDG 10", "SDG 13", "SDG 17"], correctIndex: 2, explanation: "Climate Action is Sustainable Development Goal 13.", difficulty: "easy" },
      { id: "m5-e2", question: "When were the SDGs adopted?", options: ["2010", "2015", "2020", "2000"], correctIndex: 1, explanation: "The SDGs were adopted by the United Nations in 2015.", difficulty: "easy" },
      { id: "m5-e3", question: "How many SDGs are there in total?", options: ["10", "15", "17", "20"], correctIndex: 2, explanation: "There are 17 Sustainable Development Goals.", difficulty: "easy" },
      { id: "m5-e4", question: "What is the Paris Agreement about?", options: ["Trade agreements", "Limiting global warming to well below 2°C", "Military alliances", "Space exploration"], correctIndex: 1, explanation: "The Paris Agreement commits nations to limiting warming to well below 2°C above pre-industrial levels.", difficulty: "easy" },
      { id: "m5-e5", question: "By what year has Nigeria committed to achieving net-zero emissions?", options: ["2030", "2040", "2050", "2060"], correctIndex: 3, explanation: "Nigeria has committed to achieving net-zero emissions by 2060.", difficulty: "easy" },
      { id: "m5-m1", question: "How does SDG 13 connect to SDG 2 (Zero Hunger)?", options: ["They are unrelated", "Climate change disrupts food production through changing weather patterns", "Hunger causes climate change", "SDG 2 only applies to developed countries"], correctIndex: 1, explanation: "Climate change threatens food production and security through altered weather patterns.", difficulty: "medium" },
      { id: "m5-m2", question: "What are Nationally Determined Contributions (NDCs)?", options: ["Financial donations to the UN", "Country-specific climate action plans submitted under the Paris Agreement", "National budgets", "Trade agreements"], correctIndex: 1, explanation: "NDCs are plans outlining each country's climate targets and strategies under the Paris Agreement.", difficulty: "medium" },
      { id: "m5-m3", question: "What is Nigeria's unconditional emissions reduction target by 2030?", options: ["10%", "20%", "30%", "50%"], correctIndex: 1, explanation: "Nigeria committed to a 20% unconditional reduction in greenhouse gas emissions by 2030.", difficulty: "medium" },
      { id: "m5-m4", question: "Why is youth engagement described as 'critical' for climate action?", options: ["Young people don't care about climate", "Their lives will be most affected by today's climate decisions", "Only adults can make changes", "Youth movements are ineffective"], correctIndex: 1, explanation: "Young people are current stakeholders whose lives will be most impacted by climate decisions made today.", difficulty: "medium" },
      { id: "m5-m5", question: "How does climate change affect SDG 3 (Good Health)?", options: ["It improves health", "It increases disease spread, air pollution, and heat-related health issues", "Health and climate are unrelated", "Only mental health is affected"], correctIndex: 1, explanation: "Climate change increases disease vectors, worsens air quality, and causes heat-related health problems.", difficulty: "medium" },
      { id: "m5-h1", question: "Why might achieving SDG 13 be considered a prerequisite for achieving most other SDGs?", options: ["SDG 13 is the easiest", "Climate change impacts poverty, food, health, water, and ecosystems — undermining progress on multiple goals", "Other SDGs don't depend on climate", "The SDGs are independent"], correctIndex: 1, explanation: "Climate change undermines progress across poverty, food security, health, water, and ecosystems simultaneously.", difficulty: "hard" },
      { id: "m5-h2", question: "What is the difference between 'unconditional' and 'conditional' targets in Nigeria's NDC?", options: ["They mean the same thing", "Unconditional targets Nigeria will meet alone; conditional targets require international financial/technical support", "Conditional is mandatory", "Unconditional means optional"], correctIndex: 1, explanation: "Unconditional targets are self-funded commitments; conditional targets depend on international support.", difficulty: "hard" },
      { id: "m5-h3", question: "How does the concept of 'common but differentiated responsibilities' apply to global climate negotiations?", options: ["All countries have equal responsibility", "Historically high-emitting nations bear greater responsibility but all must act according to their capabilities", "Only developing countries should act", "Responsibility is optional"], correctIndex: 1, explanation: "Developed nations that historically emitted more bear greater responsibility, while all nations contribute according to capacity.", difficulty: "hard" },
      { id: "m5-h4", question: "Why is Nigeria's 2060 net-zero target both significant and challenging?", options: ["It's easy to achieve", "Nigeria's economy depends heavily on fossil fuels, making transition difficult but the commitment signals serious intent", "Net-zero is impossible", "2060 is too far away to matter"], correctIndex: 1, explanation: "As Africa's largest oil producer, achieving net-zero requires massive economic transformation.", difficulty: "hard" },
      { id: "m5-h5", question: "How can digital platforms and apps contribute to SDG 4 (Quality Education) and SDG 13 simultaneously?", options: ["They can't contribute to both", "They make climate education accessible, engaging, and scalable, serving both educational quality and climate awareness goals", "Only formal schooling counts", "Apps are distractions"], correctIndex: 1, explanation: "Digital platforms deliver quality climate education at scale, advancing both educational access and climate awareness.", difficulty: "hard" },
    ],
  },
];
