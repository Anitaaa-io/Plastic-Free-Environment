"""
Environmental AI Knowledge Base & Query Engine
Provides verified domain knowledge on plastic pollution, resin codes,
waste segregation, sustainable alternatives, and local B.Tech CSP Project context.
"""
import re

CSP_CONTEXT = {
    "project_title": "Plastic Free Environment – Community Sustainability Platform",
    "department": "Department of Computer Science & Engineering (Data Science) [CSE (DS)]",
    "location": "Narasaraopet, Palnadu District, Andhra Pradesh (PIN: 522601)",
    "field_study_area": "ZPH School, Lingamguntla Agraharam (Rural)",
    "study_date": "29 June 2026",
    "team_members": [
        {"name": "B. Bhavya Sai Sri", "roll": "24471A4402", "role": "Lead Researcher & Project Lead"},
        {"name": "M. Aparna", "roll": "24471A4425", "role": "Community Survey Coordinator"},
        {"name": "N. Esther Rani", "roll": "24471A4435", "role": "Data Analyst & Alternatives Research"},
        {"name": "T. Anitha", "roll": "24471A4461", "role": "Outreach & Youth Mobilization"},
    ],
    "faculty_guides": [
        "Mr. P. Srinivasarao",
        "Mr. P. Solman",
        "Mr. N. Siva Rama Krishna",
        "Mr. B. Veera Brahmam"
    ]
}

RESIN_CODES = {
    "1": {
        "code": "1",
        "name": "PET / PETE (Polyethylene Terephthalate)",
        "recyclable": "High (Most commonly recycled)",
        "common_uses": "Mineral water bottles, soda bottles, salad dressing containers, peanut butter jars.",
        "environmental_impact": "Single-use prone, leaches antimony and acetaldehyde when exposed to heat or reused multiple times. Breaks down into microfibers and microplastics.",
        "eco_advice": "Never reuse single-use PET bottles for drinking water, especially when exposed to direct sunlight or warm vehicles. Recycle via clean dry segregation."
    },
    "2": {
        "code": "2",
        "name": "HDPE (High-Density Polyethylene)",
        "recyclable": "High (Easily recyclable into pipes, benches, new bottles)",
        "common_uses": "Milk jugs, shampoo and detergent bottles, bleach containers, motor oil bottles.",
        "environmental_impact": "Relatively stable and safer for reuse than PET, but persists for hundreds of years in landfills and oceans.",
        "eco_advice": "Rinse thoroughly and place in the dry recycling bin. Highly sought after by municipal and private plastic recyclers."
    },
    "3": {
        "code": "3",
        "name": "PVC (Polyvinyl Chloride)",
        "recyclable": "Very Low (Difficult and toxic to recycle)",
        "common_uses": "Plumbing pipes, medical tubing, faux leather, wire jacketing, cling wraps.",
        "environmental_impact": "Known as the 'poison plastic'—contains toxic phthalates, lead, and dioxins during manufacture and incineration. Carcinogenic hazard.",
        "eco_advice": "Avoid food-contact PVC plastics entirely. Look for phthalate-free, non-PVC alternatives."
    },
    "4": {
        "code": "4",
        "name": "LDPE (Low-Density Polyethylene)",
        "recyclable": "Moderate to Low (Can clog standard sorting machinery)",
        "common_uses": "Single-use grocery carry bags, bread bags, shrink wrap, squeezable bottles.",
        "environmental_impact": "Primary culprit behind urban drainage clogs, choking livestock, and ocean entanglement. Takes 500+ years to degrade photodegradatively.",
        "eco_advice": "Refuse LDPE carry bags! Switch strictly to cloth, cotton, or jute bags for all grocery trips."
    },
    "5": {
        "code": "5",
        "name": "PP (Polypropylene)",
        "recyclable": "Moderate (Recycled into battery cables, brooms, trays)",
        "common_uses": "Yogurt cups, medicine containers, straw caps, microwaveable food containers.",
        "environmental_impact": "High melting point makes it heat-resistant and food-safe, but low global recycling rates (< 3%) mean most ends up in landfills.",
        "eco_advice": "Wash and reuse sturdy PP containers for household storage instead of throwing away immediately."
    },
    "6": {
        "code": "6",
        "name": "PS (Polystyrene / Styrofoam)",
        "recyclable": "Very Low (Economically unfeasible to recycle)",
        "common_uses": "Disposable cups, meat trays, egg cartons, thermocol packaging buffers.",
        "environmental_impact": "Leaches styrene (a suspected human neurotoxin and carcinogen) when in contact with hot liquids. Extremely light, floats into waterways and breaks into toxic crumbs.",
        "eco_advice": "Refuse thermocol and disposable foam cups. Opt for ceramic, steel, or clay kulhads."
    },
    "7": {
        "code": "7",
        "name": "OTHER (BPA, Polycarbonate, Mixed Plastics & Bioplastics)",
        "recyclable": "Extremely Low / Non-recyclable by municipal streams",
        "common_uses": "Multi-layer chip packets, sunglasses, nylon, large water cooler jugs, PLA bioplastics.",
        "environmental_impact": "Often contains Bisphenol A (BPA), an endocrine disruptor. Multi-layer packaging (MLP) cannot be separated easily.",
        "eco_advice": "Minimize purchase of multi-layer packaged snacks and look for BPA-free certification."
    }
}

def answer_environmental_query(query_text):
    """
    Evaluates user prompt and generates an expert, structured environmental response.
    """
    q = query_text.lower().strip()
    
    # 1. Resin codes query
    resin_match = re.search(r'\b(resin|code|number|type)\s*#?\s*([1-7])\b', q) or re.search(r'\bpet\b|\bhdpe\b|\bpvc\b|\bldpe\b|\bpolypropylene\b|\bpolystyrene\b|\bstyrofoam\b', q)
    if resin_match:
        matched_code = None
        if resin_match.groups() and len(resin_match.groups()) >= 2:
            matched_code = resin_match.group(2)
        elif 'pet' in q:
            matched_code = '1'
        elif 'hdpe' in q:
            matched_code = '2'
        elif 'pvc' in q:
            matched_code = '3'
        elif 'ldpe' in q:
            matched_code = '4'
        elif 'pp' in q or 'polypropylene' in q:
            matched_code = '5'
        elif 'ps' in q or 'polystyrene' in q or 'styrofoam' in q:
            matched_code = '6'

        if matched_code and matched_code in RESIN_CODES:
            item = RESIN_CODES[matched_code]
            return {
                "answer": (
                    f"### 🏷️ Resin Identification Code #{item['code']}: {item['name']}\n\n"
                    f"- **Recyclability:** {item['recyclable']}\n"
                    f"- **Common Everyday Uses:** {item['common_uses']}\n"
                    f"- **Environmental & Health Impact:** {item['environmental_impact']}\n\n"
                    f"> **💡 Sustainable Action Advice:** {item['eco_advice']}\n\n"
                    f"You can explore all seven resin types on our [Education Center](/education)."
                ),
                "suggestions": [
                    "Tell me about Resin Code #2 (HDPE)",
                    "Is Resin Code #6 (Styrofoam) toxic?",
                    "How to segregate plastics for recycling?",
                    "What are the 5 R's of waste management?"
                ]
            }

    # 2. Project & CSP Team query
    if any(k in q for k in ['csp', 'b.tech', 'college', 'team', 'author', 'bhavya', 'aparna', 'esther', 'anitha', 'zph', 'lingamguntla', 'narasaraopet', 'faculty', 'guide']):
        team_list = "\n".join([f"- **{m['name']}** ({m['roll']}) – *{m['role']}*" for m in CSP_CONTEXT['team_members']])
        guides_list = ", ".join(CSP_CONTEXT['faculty_guides'])
        return {
            "answer": (
                f"### 🎓 B.Tech Community Service Project (CSP) Details\n\n"
                f"**Project Title:** {CSP_CONTEXT['project_title']}\n"
                f"**Institution & Dept:** {CSP_CONTEXT['department']}, Narasaraopet, Palnadu District, AP (PIN: 522601).\n\n"
                f"**Field Study Area:** {CSP_CONTEXT['field_study_area']}\n"
                f"**Field Research Date:** {CSP_CONTEXT['study_date']}\n\n"
                f"#### 👥 Student Research Team:\n{team_list}\n\n"
                f"#### 👨‍🏫 Faculty Guides:\n{guides_list}\n\n"
                f"This initiative integrates field surveys, school awareness programs, and this full-stack digital platform to drive tangible plastic waste reduction."
            ),
            "suggestions": [
                "What was the field visit finding at ZPH School?",
                "How can I take the plastic-free pledge?",
                "How do I report plastic waste in Narasaraopet?"
            ]
        }

    # 3. 5 R's query
    if any(k in q for k in ['5 r', '5r', 'five r', 'principles', 'refuse', 'reduce', 'reuse', 'repurpose', 'recycle']):
        return {
            "answer": (
                "### 🔄 The 5 R's of Environmental Sustainability\n\n"
                "The 5 R hierarchy prioritizes prevention before disposal:\n\n"
                "1. **🚫 REFUSE:** The most powerful action. Say NO to single-use carry bags, disposable straws, plastic cutlery, and promotional freebies.\n"
                "2. **📉 REDUCE:** Minimize consumer packaging. Buy loose grains, fresh produce in bulk, and opt for concentrates or refills.\n"
                "3. **♻️ REUSE:** Choose durable containers—stainless steel lunch boxes, refillable glass jars, and washable cloth bags.\n"
                "4. **🛠️ REPURPOSE (Upcycle):** Transform used items into planters, eco-bricks, desk organizers, or craft materials before discarding.\n"
                "5. **🔄 RECYCLE:** As a last resort, ensure rigid plastics are rinsed, dried, segregated by category, and delivered to authorized recyclers."
            ),
            "suggestions": [
                "Give me alternatives to single-use plastic bags",
                "How do microplastics affect marine life?",
                "What are the best daily zero-waste habits?"
            ]
        }

    # 4. Eco-friendly alternatives
    if any(k in q for k in ['alternative', 'replace', 'substitute', 'instead of', 'bamboo', 'jute', 'cloth bag']):
        return {
            "answer": (
                "### 🌿 Sustainable Eco-Friendly Alternatives\n\n"
                "Here are proven, non-toxic replacements for common single-use plastics:\n\n"
                "| Single-Use Plastic | Eco-Friendly Alternative | Environmental Benefit |\n"
                "|---|---|---|\n"
                "| **Plastic Carry Bags** | Jute or 100% Cotton Canvas Bags | Biodegradable, reusable 300+ times |\n"
                "| **Plastic Water Bottles** | Copper, Stainless Steel, or Glass | No BPA leaching, keeps drinks naturally cool |\n"
                "| **Plastic Straws** | Stainless Steel, Bamboo, or Papaya Leaf | Zero microplastics, washable and durable |\n"
                "| **Disposable Cutlery** | Birchwood, Bamboo, or Edible Wheat Spoons | Fully compostable within 90 days |\n"
                "| **Plastic Food Wraps** | Reusable Beeswax Wraps or Steel Tiffins | Non-toxic, preserves food freshness |\n"
                "| **Plastic Toothbrushes** | Bamboo Toothbrush with Castor Oil Bristles | 95% compostable handle reduces landfill burden |\n\n"
                "Browse our interactive guide at [Eco-Friendly Alternatives](/alternatives) to see local vendors and pricing."
            ),
            "suggestions": [
                "What can replace plastic food packaging?",
                "Where can I buy jute bags in Narasaraopet?",
                "How can I earn eco points on this platform?"
            ]
        }

    # 5. Waste segregation & recycling tips
    if any(k in q for k in ['segregat', 'recycle', 'bin', 'trash', 'garbage', 'how to clean', 'dry waste', 'wet waste']):
        return {
            "answer": (
                "### 🗑️ Smart Waste Segregation Guide\n\n"
                "Segregation at source is mandatory for effective recycling:\n\n"
                "- **🟢 Green Bin (Wet Organic Waste):** Kitchen scraps, fruit peels, leftover food, garden leaves. Converts into rich compost within 45 days.\n"
                "- **🔵 Blue Bin (Dry Recyclable Waste):** Clean plastic bottles, rinsed milk packets, cardboard boxes, tin cans, glass jars. **Important:** Plastics must be clean and completely dry to prevent batch contamination!\n"
                "- **🔴 Red Bin (Sanitary & Domestic Hazardous Waste):** Broken bulbs, batteries, expired medicines, sanitary napkins, insect spray cans. Must be incinerated safely in authorized facilities.\n\n"
                "> **💡 Pro Tip:** Cut milk packets along the corner without severing the tiny plastic tip; loose plastic snippets escape recycling belts and end up in drains."
            ),
            "suggestions": [
                "What are the 7 plastic resin codes?",
                "How do I report an illegal garbage dump?",
                "What events are happening near me?"
            ]
        }

    # 6. Marine & Soil impact
    if any(k in q for k in ['marine', 'ocean', 'soil', 'earth', 'animal', 'cow', 'fish', 'microplastic', 'health']):
        return {
            "answer": (
                "### 🌊 Impact of Plastic on Ecosystems & Human Health\n\n"
                "#### 1. Marine & Aquatic Life:\n"
                "- Over **14 million tons** of plastic enter oceans annually.\n"
                "- Marine animals (turtles, fish, seabirds) ingest floating plastics mistaking them for food, leading to intestinal blockage and starvation.\n"
                "- Microplastics bioaccumulate up the trophic chain, eventually reaching human seafood plates.\n\n"
                "#### 2. Soil & Agriculture (Rural & Palnadu District Impact):\n"
                "- Plastics buried in agricultural soil prevent water percolation, choke earthworms, and hinder root penetration.\n"
                "- Stray cattle and livestock ingest plastic bags while foraging garbage dumps, causing fatal rumen impaction.\n\n"
                "#### 3. Human Health Risks:\n"
                "- Chemicals like Phthalates and Bisphenol A (BPA) mimic human hormones, contributing to fertility disruption and metabolic imbalances."
            ),
            "suggestions": [
                "What are the 5 R's?",
                "How to report a plastic waste dump?",
                "Take the Plastic-Free Pledge now"
            ]
        }

    # 7. Platform Features / How to earn points / report / pledge
    if any(k in q for k in ['point', 'badge', 'report', 'pledge', 'level', 'gamif', 'how to use', 'volunteer', 'cleanup']):
        return {
            "answer": (
                "### 🌟 How to Use & Earn on the Platform\n\n"
                "1. **✍️ Take the Plastic-Free Pledge (+50 pts):** Make a formal commitment as a student, household, merchant, or citizen and download your verified certificate at [Pledge Page](/pledge).\n"
                "2. **📸 Report Plastic Hotspots (+50 pts):** Spot an illegal plastic dump or clogged drain? Snap a photo, choose the location, and submit at [Waste Reports](/waste-reports). You'll receive a unique tracking ID (`#WR-2026-XXXX`).\n"
                "3. **🎯 Daily Challenges (+25 to +40 pts):** Complete daily zero-waste challenges (e.g. carry a cloth bag, refuse straws) in your [User Dashboard](/dashboard).\n"
                "4. **🤝 Volunteer for Cleanup Drives (+100 pts):** Join organized community cleanup campaigns in Palnadu and Narasaraopet via [Cleanup Events](/cleanup-events).\n"
                "5. **🏆 Badges & Levels:** Level up from **Seedling Advocate** to **Forest Master** (Levels 1 to 5) and display your badges on the community leaderboard!"
            ),
            "suggestions": [
                "Show my user dashboard",
                "What are the resin codes?",
                "Tell me about the CSP research team"
            ]
        }

    # Default fallback intelligent response
    return {
        "answer": (
            "Hello! I am your **Eco AI Sustainability Assistant**, trained on environmental science, plastic waste management, and the verified research of the **B.Tech CSP Team** from Narasaraopet.\n\n"
            "I can help you with:\n"
            "- 🏷️ **Resin Identification Codes (1-7):** Toxicity, safety, and recyclability.\n"
            "- 🌿 **Eco Alternatives:** Practical plastic substitutes for everyday living.\n"
            "- 🔄 **The 5 R's:** Refuse, Reduce, Reuse, Repurpose, Recycle.\n"
            "- 🗑️ **Waste Segregation:** Proper techniques for clean recycling.\n"
            "- 📍 **Platform Actions:** Pledging, reporting waste spots with tracking IDs, and earning eco points.\n"
            "- 👥 **CSP Field Data:** Insights from our 29 June 2026 ZPH School study.\n\n"
            "What topic would you like to explore?"
        ),
        "suggestions": [
            "Explain Resin Codes 1 to 7",
            "What are the 5 R's of waste management?",
            "What are good alternatives to single-use plastics?",
            "Tell me about the B.Tech CSP Team and field study"
        ]
    }

