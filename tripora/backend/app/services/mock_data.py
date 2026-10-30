from typing import List, Dict, Any
from app.models.destination import Destination, Attraction, ActivitySuggestion
from app.models.trip import Trip
from app.models.itinerary import ItineraryDay, Activity

SAMPLE_DESTINATIONS: List[Destination] = [
    Destination(
        id="kyoto-japan",
        name="Kyoto",
        country="Japan",
        region="Kansai",
        tagline="Timeless temples, bamboo groves, and ancient tea ceremonies",
        description="Kyoto, once the capital of Japan, is a refined city where classical Buddhist temples, Zen gardens, imperial palaces, and traditional wooden houses blend with lush forested hills.",
        hero_image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        category="cultural",
        tags=["Temples", "Gastronomy", "History", "Zen Gardens"],
        estimated_budget_range="$180 - $350 / day",
        avg_daily_cost=240.0,
        currency="USD",
        best_travel_period="March - May & October - November",
        is_sample_data=True,
        overview="Immerse yourself in centuries of preserved culture, serene moss gardens of Arashiyama, morning strolls through thousands of vermilion torii gates at Fushimi Inari, and multi-course kaiseki dining in Gion.",
        popular_attractions=[
            Attraction(
                name="Fushimi Inari Shrine",
                category="Culture",
                description="Iconic mountain trail lined with over 10,000 vivid vermilion torii gates dedicated to Inari, the Shinto god of rice and agriculture.",
                estimated_cost=0.0,
                recommended_duration="2 - 3 hours",
                image_url="https://images.unsplash.com/photo-1478436127897-769e00d0c71e?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Kinkaku-ji (Golden Pavilion)",
                category="Historic Landmark",
                description="A Zen Buddhist temple whose top two floors are completely covered in gold leaf, overlooking the reflective Mirror Pond.",
                estimated_cost=5.0,
                recommended_duration="1.5 hours",
                image_url="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Arashiyama Bamboo Grove",
                category="Nature",
                description="Towering stalks of green bamboo create an ethereal, rustling corridor that transports travelers to an ancient realm.",
                estimated_cost=0.0,
                recommended_duration="2 hours",
                image_url="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Traditional Matcha Tea Ceremony in Gion",
                type="Cultural Immersion",
                highlight="Learn the meditative rituals of Chado from a certified tea master in a 200-year-old machiya house.",
                best_time="Afternoon (14:00)"
            ),
            ActivitySuggestion(
                title="Early Morning Philosopher's Path Walk",
                type="Scenic Walk",
                highlight="Stone path along a cherry-tree-lined canal connecting Ginkaku-ji to Nanzen-ji temple.",
                best_time="Early Morning (07:00)"
            ),
            ActivitySuggestion(
                title="Nishiki Market Culinary Safari",
                type="Food Experience",
                highlight="Sample skewered baby octopus, matcha soft serve, fresh yuba, and dashi omelets from generational vendors.",
                best_time="Lunchtime (11:30)"
            )
        ],
        travel_tips=[
            "Purchase an IC card (ICOCA/Suica) for seamless subway and bus transit.",
            "Visit Fushimi Inari at dawn (06:30) to experience the peaceful spirit before tour buses arrive.",
            "Reserve kaiseki and fine dining at least 4 weeks in advance.",
            "Remember to wear slip-on shoes as temple halls require removing footwear."
        ],
        latitude=35.0116,
        longitude=135.7681
    ),
    Destination(
        id="amalfi-coast-italy",
        name="Amalfi Coast",
        country="Italy",
        region="Campania",
        tagline="Pastel cliffside villages tumbling into the sparkling Tyrrhenian Sea",
        description="A 50-kilometer stretch of mountainous coastline featuring pastel-colored fishing villages, steep terraced lemon groves, and azure waters.",
        hero_image="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
        category="romantic",
        tags=["Coastal Views", "Italian Food", "Boat Tours", "Romantic"],
        estimated_budget_range="$220 - $550 / day",
        avg_daily_cost=360.0,
        currency="USD",
        best_travel_period="May - June & September - October",
        is_sample_data=True,
        overview="From Positano's steep cascading staircases to Ravello's cliff-top gardens with panoramic views, the Amalfi Coast is the pinnacle of Mediterranean romance and coastal leisure.",
        popular_attractions=[
            Attraction(
                name="Positano Cliffside Village",
                category="Scenic Village",
                description="A cascade of peach, pink, and terracotta villas hugging vertical limestone cliffs dropping straight into Spiaggia Grande.",
                estimated_cost=0.0,
                recommended_duration="Full Day",
                image_url="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Villa Cimbrone Gardens, Ravello",
                category="Botanical Garden",
                description="Perched 350 meters above the sea, featuring the iconic 'Terrace of Infinity' adorned with marble Roman busts.",
                estimated_cost=10.0,
                recommended_duration="2.5 hours",
                image_url="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Path of the Gods (Sentiero degli Dei)",
                category="Hiking & Adventure",
                description="Spectacular clifftop hiking trail high above the coastline offering sensational views of the Sorrentine Peninsula and Capri.",
                estimated_cost=0.0,
                recommended_duration="4 hours",
                image_url="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Private Wooden Gozzo Boat Tour to Capri",
                type="Maritime Adventure",
                highlight="Swim in hidden emerald grottos and cruise past the iconic Faraglioni rock formations.",
                best_time="Morning (09:00 - 15:00)"
            ),
            ActivitySuggestion(
                title="Limoncello Crafting & Lemon Grove Tour in Amalfi",
                type="Culinary Experience",
                highlight="Walk through ancient family orchards of Sfusato Amalfitano lemons and taste handcrafted liqueurs.",
                best_time="Late Morning (11:00)"
            )
        ],
        travel_tips=[
            "Prefer ferries over buses between towns; they avoid hairpin traffic jams and offer unbeatable coastal panoramas.",
            "Pack sturdy walking shoes with grip—Amalfi is defined by thousands of vertical steps.",
            "Book accommodations in quieter towns like Praiano or Minori for more authentic dining at gentle prices."
        ],
        latitude=40.6340,
        longitude=14.6027
    ),
    Destination(
        id="reykjavik-iceland",
        name="Reykjavík & Southern Wilds",
        country="Iceland",
        region="Capital & South Shore",
        tagline="Land of glaciers, volcanic craters, geothermal lagoons, and northern auroras",
        description="A vibrant Nordic harbor capital serving as the gateway to thunderous waterfalls, black sand beaches, glowing ice caves, and soothing thermal baths.",
        hero_image="https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=800&q=80",
        category="adventure",
        tags=["Glaciers", "Geothermal", "Northern Lights", "Waterfalls"],
        estimated_budget_range="$240 - $480 / day",
        avg_daily_cost=310.0,
        currency="USD",
        best_travel_period="June - August (Midnight Sun) or Nov - March (Auroras)",
        is_sample_data=True,
        overview="From soaking in mineral-rich milky blue waters to trekking across millennia-old outlet glaciers, Iceland offers an encounter with Earth's raw geological power.",
        popular_attractions=[
            Attraction(
                name="Blue Lagoon Geothermal Spa",
                category="Wellness & Spa",
                description="Geothermal seawater rich in silica and sulfur nestled in the heart of a 800-year-old black lava field.",
                estimated_cost=90.0,
                recommended_duration="3 hours",
                image_url="https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Skógafoss Waterfall",
                category="Natural Wonder",
                description="One of the biggest waterfalls in the country with a 60-meter drop creating permanent mist rainbows.",
                estimated_cost=0.0,
                recommended_duration="1.5 hours",
                image_url="https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Reynisfjara Black Sand Beach",
                category="Coastal Nature",
                description="World-renowned black volcanic sand beach featuring geometric basalt columns and roaring Atlantic breakers.",
                estimated_cost=0.0,
                recommended_duration="2 hours",
                image_url="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Guided Glacier Hike on Sólheimajökull",
                type="Glacial Adventure",
                highlight="Crampon-equipped trek past deep crevasses and volcanic ash layers with an experienced mountain guide.",
                best_time="Morning (10:00)"
            ),
            ActivitySuggestion(
                title="Northern Lights Boat Cruise from Reykjavik Harbor",
                type="Night Tour",
                highlight="Sail away from city light pollution into Faxaflói Bay to watch dancing green auroras reflected on ocean waves.",
                best_time="Night (21:30 - Winter)"
            )
        ],
        travel_tips=[
            "Layering is essential: thermal merino base, fleece mid-layer, and wind/waterproof outer shell.",
            "Iceland is almost 100% cashless; contactless cards are accepted everywhere.",
            "Never turn your back on the ocean at Reynisfjara due to dangerous sneaker waves."
        ],
        latitude=64.1466,
        longitude=-21.9426
    ),
    Destination(
        id="cape-town-south-africa",
        name="Cape Town",
        country="South Africa",
        region="Western Cape",
        tagline="Dramatic ocean cliffs, rugged peaks, and world-class wine valleys",
        description="Cradled between the iconic flat top of Table Mountain and the cobalt Atlantic, Cape Town combines cosmopolitan energy with stunning coastal biodiversity.",
        hero_image="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        category="trending",
        tags=["Coastal Views", "Wine Tasting", "Wildlife", "Surfing"],
        estimated_budget_range="$110 - $260 / day",
        avg_daily_cost=175.0,
        currency="USD",
        best_travel_period="November - April",
        is_sample_data=True,
        overview="Ascend Table Mountain via rotating cable car, visit African penguins at Boulders Beach, and sip Pinotage in the sun-drenched vineyards of Stellenbosch.",
        popular_attractions=[
            Attraction(
                name="Table Mountain Aerial Cableway",
                category="Scenic Landmark",
                description="World Heritage site offering 360-degree views over the Atlantic Ocean, city bowl, and Lion's Head.",
                estimated_cost=25.0,
                recommended_duration="3 hours",
                image_url="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Boulders Beach Penguin Colony",
                category="Wildlife Reserve",
                description="Sheltered sandy coves where thousands of endangered African penguins roam freely between ancient granite boulders.",
                estimated_cost=10.0,
                recommended_duration="2 hours",
                image_url="https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Cape Winelands Tasting in Franschhoek",
                type="Wine & Gastronomy",
                highlight="Hop on the open-air wine tram through historic Cape Dutch estates for award-winning pairings.",
                best_time="All Day (10:00 - 17:00)"
            ),
            ActivitySuggestion(
                title="Sunset Drive along Chapman's Peak",
                type="Scenic Coastal Drive",
                highlight="One of the world's most spectacular marine drives carved into sheer rock faces overlooking Hout Bay.",
                best_time="Golden Hour (18:00)"
            )
        ],
        travel_tips=[
            "Check Table Mountain cableway status in the morning; operations pause during strong winds.",
            "Use Uber for safe, reliable, and very affordable urban transportation.",
            "Tipping around 10-15% is standard practice in restaurants and cafés."
        ],
        latitude=-33.9249,
        longitude=18.4241
    ),
    Destination(
        id="oaxaca-mexico",
        name="Oaxaca de Juárez",
        country="Mexico",
        region="Oaxaca Valley",
        tagline="Gastronomic capital of Mexico, indigenous textiles, and artisanal mezcal",
        description="A vibrant colonial UNESCO treasure nestled in a highland valley, celebrated for its seven moles, bustling markets, and ancient Zapotec ruins.",
        hero_image="https://images.unsplash.com/photo-1512816927457-393282b79a5b?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80",
        category="budget",
        tags=["Food & Mezcal", "Indigenous Art", "Colonial History", "Affordable"],
        estimated_budget_range="$70 - $160 / day",
        avg_daily_cost=110.0,
        currency="USD",
        best_travel_period="October - March",
        is_sample_data=True,
        overview="Stroll through cobblestone streets of Santo Domingo, savor tlayudas at smoke-filled alleyways, and visit generational mezcal palenques.",
        popular_attractions=[
            Attraction(
                name="Monte Albán Archaeological Site",
                category="Ancient Ruins",
                description="Magnificent pre-Columbian ceremonial center flattened atop a mountain with 360-degree views of the Oaxaca Valley.",
                estimated_cost=5.0,
                recommended_duration="3 hours",
                image_url="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Templo de Santo Domingo de Guzmán",
                category="Baroque Architecture",
                description="Jaw-dropping 16th-century Dominican church with intricate gilded interior walls and adjacent botanical garden.",
                estimated_cost=0.0,
                recommended_duration="1.5 hours",
                image_url="https://images.unsplash.com/photo-1512816927457-393282b79a5b?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Traditional Oaxacan Cooking Class & Market Tour",
                type="Culinary Workshop",
                highlight="Shop with a local chef at Mercado 20 de Noviembre and hand-grind chocolate and mole negro on a stone metate.",
                best_time="Morning (09:00 - 14:00)"
            ),
            ActivitySuggestion(
                title="Artisanal Mezcal Tasting Journey",
                type="Spirit Tasting",
                highlight="Visit small-batch ancestral distilleries in Santiago Matatlán to understand wild agave varieties.",
                best_time="Afternoon (14:30)"
            )
        ],
        travel_tips=[
            "Carry cash in pesos for artisanal markets and street food stalls.",
            "Try local delicacies like chapulines (toasted grasshoppers with chili and lime) and tejate (cold maize-cacao drink).",
            "Book accommodations in Jalatlaco or Centro Histórico for tranquil, pedestrian-friendly exploration."
        ],
        latitude=17.0732,
        longitude=-96.7266
    ),
    Destination(
        id="banff-canada",
        name="Banff & Lake Louise",
        country="Canada",
        region="Alberta Rockies",
        tagline="Turquoise glacial waters framed by soaring alpine peaks and pine forests",
        description="Canada's first national park, featuring striking turquoise glacial lakes, wildlife corridors, thermal springs, and endless alpine trails.",
        hero_image="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        category="adventure",
        tags=["Alpine Lakes", "Hiking", "Skiing", "Scenic Nature"],
        estimated_budget_range="$190 - $420 / day",
        avg_daily_cost=275.0,
        currency="USD",
        best_travel_period="June - August (Hiking) & Dec - March (Skiing)",
        is_sample_data=True,
        overview="Canoe across the surreal emerald waters of Lake Moraine, hike to historic backcountry teahouses, and unwind in Banff's natural thermal hot springs.",
        popular_attractions=[
            Attraction(
                name="Moraine Lake & Valley of the Ten Peaks",
                category="Glacial Wonder",
                description="Glacially-fed lake of brilliant vivid turquoise framed by ten towering 3,000-meter rocky peaks.",
                estimated_cost=15.0,
                recommended_duration="3 - 4 hours",
                image_url="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Banff Gondola & Sulphur Mountain",
                category="Panoramic Viewpoint",
                description="Soar to 2,281 meters above sea level with views extending across six mountain ranges.",
                estimated_cost=55.0,
                recommended_duration="2.5 hours",
                image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Hike to Lake Agnes Historic Teahouse",
                type="Alpine Hike",
                highlight="Moderate 7 km round-trip climb from Lake Louise to a rustic, electricity-free teahouse built in 1901.",
                best_time="Morning (08:30)"
            ),
            ActivitySuggestion(
                title="Icefields Parkway Scenic Mountain Drive",
                type="Iconic Road Trip",
                highlight="Drive alongside ancient glaciers, thundering waterfalls, and weeping walls linking Banff to Jasper.",
                best_time="Full Day"
            )
        ],
        travel_tips=[
            "Parks Canada Discovery Pass is mandatory for park entry.",
            "Moraine Lake is closed to private vehicles; reserve Parks Canada shuttles well in advance.",
            "Carry bear spray and know how to use it when hiking anywhere in the park."
        ],
        latitude=51.1784,
        longitude=-115.5708
    ),
    Destination(
        id="lisbon-portugal",
        name="Lisbon & Sintra",
        country="Portugal",
        region="Estremadura",
        tagline="Sun-kissed terracotta rooftops, historic yellow trams, and fairy-tale palaces",
        description="Europe's vibrant coastal capital perched on seven hills overlooking the Tagus River, famed for azulejo tiles, soulful Fado music, and pastel de nata.",
        hero_image="https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1600&q=80",
        card_image="https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80",
        category="weekend",
        tags=["European Charm", "Tile Architecture", "Pastries", "Coastal Day Trips"],
        estimated_budget_range="$120 - $270 / day",
        avg_daily_cost=180.0,
        currency="USD",
        best_travel_period="April - June & September - October",
        is_sample_data=True,
        overview="Wander the cobblestone alleys of Alfama, catch golden hour at Miradouro de Santa Catarina, and take a 30-minute train ride to romantic fairy-tale Sintra palaces.",
        popular_attractions=[
            Attraction(
                name="Pena Palace, Sintra",
                category="Romantic Castle",
                description="A whimsical 19th-century Romanticist castle glowing in vivid yellow, red, and purple atop the Sintra mountains.",
                estimated_cost=15.0,
                recommended_duration="3 hours",
                image_url="https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=600&q=80"
            ),
            Attraction(
                name="Belém Tower & Jerónimos Monastery",
                category="Manueline Heritage",
                description="Sensational 16th-century maritime fortifications celebrating the Age of Discoveries.",
                estimated_cost=12.0,
                recommended_duration="2.5 hours",
                image_url="https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80"
            )
        ],
        suggested_activities=[
            ActivitySuggestion(
                title="Tram 28 Scenic Route & Miradouros Walk",
                type="City Exploration",
                highlight="Clatter through historic neighborhoods in an antique 1930s yellow tram with stopovers at panoramic viewpoints.",
                best_time="Early Morning (08:00)"
            ),
            ActivitySuggestion(
                title="Intimate Fado & Petiscos Night in Alfama",
                type="Musical & Culinary",
                highlight="Listen to sorrowful acoustic Fado ballads while savoring grilled sardines and Vinho Verde in a candlelit tavern.",
                best_time="Evening (20:30)"
            )
        ],
        travel_tips=[
            "Wear shoes with excellent traction—Lisbon's polished calçada portuguesa cobblestones can be slippery.",
            "Buy a 24-hour Viva Viagem public transport card for unlimited metro, tram, and elevator rides.",
            "Visit Pastéis de Belém early morning or late evening to skip the longest queues."
        ],
        latitude=38.7223,
        longitude=-9.1393
    )
]

# Sample pre-existing trips for instant exploration
SAMPLE_TRIPS: List[Dict[str, Any]] = [
    {
        "id": "trip-amalfi-01",
        "user_id": "demo-user-123",
        "title": "Sunlit Amalfi & Capri Coastal Escape",
        "destination": "Amalfi Coast",
        "country": "Italy",
        "start_date": "2026-11-15",
        "end_date": "2026-11-19",
        "status": "upcoming",
        "cover_image_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
        "adults": 2,
        "children": 0,
        "traveler_type": "couple",
        "total_budget": 3400.0,
        "currency": "USD",
        "accommodation_class": "boutique",
        "travel_pace": "balanced",
        "personalities": ["Romantic", "Cultural", "Food Exploration"],
        "interests": ["Scenic Views", "Italian Food", "Coastal Ferries"],
        "summary": "A 5-day Mediterranean getaway covering Positano's pastel stairways, cliff-hanging villas in Ravello, private wooden boat rides to Capri, and candlelit seafood dinners.",
        "created_at": "2026-10-20T10:00:00Z",
        "updated_at": "2026-10-20T10:00:00Z"
    },
    {
        "id": "trip-kyoto-02",
        "user_id": "demo-user-123",
        "title": "Kyoto Zen Gardens & Autumn Tea Paths",
        "destination": "Kyoto",
        "country": "Japan",
        "start_date": "2026-12-01",
        "end_date": "2026-12-06",
        "status": "draft",
        "cover_image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        "adults": 1,
        "children": 0,
        "traveler_type": "solo",
        "total_budget": 2100.0,
        "currency": "USD",
        "accommodation_class": "comfort",
        "travel_pace": "relaxed",
        "personalities": ["Cultural", "Relaxation", "Food Exploration"],
        "interests": ["Temples", "Matcha", "Photography", "Gardens"],
        "summary": "Meditative solo exploration through Arashiyama's whispering bamboo, quiet early mornings at Fushimi Inari, and authentic kaiseki dining.",
        "created_at": "2026-10-25T14:30:00Z",
        "updated_at": "2026-10-25T14:30:00Z"
    },
    {
        "id": "trip-iceland-03",
        "user_id": "demo-user-123",
        "title": "Icelandic Aurora & Glacial Discovery",
        "destination": "Reykjavík & Southern Wilds",
        "country": "Iceland",
        "start_date": "2026-09-10",
        "end_date": "2026-09-15",
        "status": "completed",
        "cover_image_url": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80",
        "adults": 2,
        "children": 1,
        "traveler_type": "family",
        "total_budget": 4200.0,
        "currency": "USD",
        "accommodation_class": "comfort",
        "travel_pace": "intense",
        "personalities": ["Adventure", "Scenic Nature"],
        "interests": ["Glaciers", "Waterfalls", "Hot Springs"],
        "summary": "Memorable road trip tracing the Golden Circle, ice cave explorations, and geothermal relaxation.",
        "created_at": "2026-08-01T09:15:00Z",
        "updated_at": "2026-09-16T12:00:00Z"
    }
]

# Sample days and activities for trip-amalfi-01
SAMPLE_ITINERARY_DAYS: Dict[str, List[Dict[str, Any]]] = {
    "trip-amalfi-01": [
        {
            "id": "day-amalfi-1",
            "trip_id": "trip-amalfi-01",
            "day_number": 1,
            "date": "2026-11-15",
            "title": "Arrival in Positano & Cliffside Welcome",
            "theme": "Arrival, Sunset Aperitivo & Mediterranean Breeze",
            "notes": "Check in to your hotel by 14:00, freshen up, and take a stroll down toward Spiaggia Grande.",
            "activities": [
                {
                    "id": "act-amalfi-1-1",
                    "day_id": "day-amalfi-1",
                    "title": "Check-in at Hotel Palazzo Murat & Freshen Up",
                    "description": "Settle into your boutique cliffside suite nestled in a tranquil 18th-century garden with panoramic sea views.",
                    "category": "hotel",
                    "start_time": "14:00",
                    "end_time": "15:30",
                    "duration_minutes": 90,
                    "cost": 380.0,
                    "currency": "USD",
                    "location_name": "Hotel Palazzo Murat, Positano",
                    "latitude": 40.6281,
                    "longitude": 14.4850,
                    "transport_mode": "taxi",
                    "transport_details": "Private car transfer from Naples Centrale Station",
                    "order_index": 1,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-1-2",
                    "day_id": "day-amalfi-1",
                    "title": "Stroll down Via dei Mulini to Spiaggia Grande",
                    "description": "Walk through bougainvillea-draped pedestrian corridors, passing local ceramic studios, linen boutiques, and lemon granita stalls.",
                    "category": "sightseeing",
                    "start_time": "16:00",
                    "end_time": "18:00",
                    "duration_minutes": 120,
                    "cost": 15.0,
                    "currency": "USD",
                    "location_name": "Spiaggia Grande, Positano",
                    "latitude": 40.6288,
                    "longitude": 14.4862,
                    "transport_mode": "walking",
                    "transport_details": "10-minute downhill walk",
                    "order_index": 2,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-1-3",
                    "day_id": "day-amalfi-1",
                    "title": "Sunset Spritz at Franco's Bar",
                    "description": "Perched high above the coast, watch the cliffs turn golden-amber with an Aperol Spritz and gourmet olives.",
                    "category": "food",
                    "start_time": "18:30",
                    "end_time": "20:00",
                    "duration_minutes": 90,
                    "cost": 65.0,
                    "currency": "USD",
                    "location_name": "Franco's Bar, Via Cristoforo Colombo",
                    "latitude": 40.6293,
                    "longitude": 14.4870,
                    "transport_mode": "walking",
                    "transport_details": "7-minute stroll uphill",
                    "order_index": 3,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-1-4",
                    "day_id": "day-amalfi-1",
                    "title": "Seafood Dinner at Ristorante Da Vincenzo",
                    "description": "Celebrated family-run trattoria since 1958 serving homemade scialatielli with fresh clams, zucchini flowers, and local Falanghina wine.",
                    "category": "food",
                    "start_time": "20:30",
                    "end_time": "22:30",
                    "duration_minutes": 120,
                    "cost": 120.0,
                    "currency": "USD",
                    "location_name": "Ristorante Da Vincenzo, Positano",
                    "latitude": 40.6300,
                    "longitude": 14.4842,
                    "transport_mode": "walking",
                    "transport_details": "5-minute walk",
                    "order_index": 4,
                    "booking_verified": False
                }
            ]
        },
        {
            "id": "day-amalfi-2",
            "trip_id": "trip-amalfi-01",
            "day_number": 2,
            "date": "2026-11-16",
            "title": "Ravello High Clifftops & Classical Romance",
            "theme": "Terrace of Infinity, Lemon Groves & Chamber Melodies",
            "notes": "Catch the morning scenic ferry to Amalfi, then local open-top shuttle up to serene Ravello.",
            "activities": [
                {
                    "id": "act-amalfi-2-1",
                    "day_id": "day-amalfi-2",
                    "title": "Morning Ferry from Positano Pier to Amalfi",
                    "description": "Glance back at Positano's pastel amphitheater from the water on a crisp coastal ferry ride.",
                    "category": "transport",
                    "start_time": "09:30",
                    "end_time": "10:15",
                    "duration_minutes": 45,
                    "cost": 30.0,
                    "currency": "USD",
                    "location_name": "Amalfi Port Dock",
                    "latitude": 40.6328,
                    "longitude": 14.6022,
                    "transport_mode": "ferry",
                    "transport_details": "Scheduled high-speed ferry",
                    "order_index": 1,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-2-2",
                    "day_id": "day-amalfi-2",
                    "title": "Explore Villa Cimbrone & The Terrace of Infinity",
                    "description": "Marvel at century-old wisteria, classical Roman busts, and uninterrupted views stretching across the Gulf of Salerno.",
                    "category": "sightseeing",
                    "start_time": "11:00",
                    "end_time": "13:00",
                    "duration_minutes": 120,
                    "cost": 25.0,
                    "currency": "USD",
                    "location_name": "Villa Cimbrone, Ravello",
                    "latitude": 40.6475,
                    "longitude": 14.6111,
                    "transport_mode": "bus",
                    "transport_details": "20-minute bus from Amalfi to Ravello",
                    "order_index": 2,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-2-3",
                    "day_id": "day-amalfi-2",
                    "title": "Terrace Lunch at Ristorante Garden Ravello",
                    "description": "Enjoy handmade ravioli capresi stuffed with caciotta cheese and fresh marjoram under a canopy of grape vines.",
                    "category": "food",
                    "start_time": "13:15",
                    "end_time": "14:45",
                    "duration_minutes": 90,
                    "cost": 85.0,
                    "currency": "USD",
                    "location_name": "Ristorante Garden, Ravello",
                    "latitude": 40.6492,
                    "longitude": 14.6120,
                    "transport_mode": "walking",
                    "transport_details": "5-minute walk",
                    "order_index": 3,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-2-4",
                    "day_id": "day-amalfi-2",
                    "title": "Visit Amalfi Cathedral (Duomo di Sant'Andrea)",
                    "description": "Admire the 9th-century striped Romanesque-Baroque facade and tranquil Cloister of Paradise.",
                    "category": "culture",
                    "start_time": "15:45",
                    "end_time": "17:15",
                    "duration_minutes": 90,
                    "cost": 10.0,
                    "currency": "USD",
                    "location_name": "Piazza del Duomo, Amalfi",
                    "latitude": 40.6343,
                    "longitude": 14.6027,
                    "transport_mode": "bus",
                    "transport_details": "Return bus down to Amalfi center",
                    "order_index": 4,
                    "booking_verified": False
                }
            ]
        },
        {
            "id": "day-amalfi-3",
            "trip_id": "trip-amalfi-01",
            "day_number": 3,
            "date": "2026-11-17",
            "title": "Private Gozzo Boat to Capri Island",
            "theme": "Grotto Swims, Faraglioni Monoliths & Capri Town",
            "notes": "Bring swimwear, towels, sun protection, and light windbreaker for the afternoon cruise.",
            "activities": [
                {
                    "id": "act-amalfi-3-1",
                    "day_id": "day-amalfi-3",
                    "title": "Private Wooden Gozzo Boat Charter",
                    "description": "Cruise around Capri, stopping to swim in crystalline emerald waters at the White and Green Grottos.",
                    "category": "adventure",
                    "start_time": "09:30",
                    "end_time": "13:30",
                    "duration_minutes": 240,
                    "cost": 320.0,
                    "currency": "USD",
                    "location_name": "Marina Grande & Faraglioni Rocks, Capri",
                    "latitude": 40.5507,
                    "longitude": 14.2426,
                    "transport_mode": "ferry",
                    "transport_details": "Private skippered boat",
                    "order_index": 1,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-3-2",
                    "day_id": "day-amalfi-3",
                    "title": "Funicular up to Capri Town & Piazzetta",
                    "description": "Ride the historic funicular up to Capri's famous square for gelato and people watching.",
                    "category": "sightseeing",
                    "start_time": "14:00",
                    "end_time": "16:30",
                    "duration_minutes": 150,
                    "cost": 40.0,
                    "currency": "USD",
                    "location_name": "Piazza Umberto I, Capri",
                    "latitude": 40.5505,
                    "longitude": 14.2428,
                    "transport_mode": "train",
                    "transport_details": "Funicular railway",
                    "order_index": 2,
                    "booking_verified": False
                },
                {
                    "id": "act-amalfi-3-3",
                    "day_id": "day-amalfi-3",
                    "title": "Sunset Cruise Back to Positano",
                    "description": "Return across the glowing sea as the Amalfi coastline lights twinkle like stars against the dark mountain silhouettes.",
                    "category": "transport",
                    "start_time": "17:00",
                    "end_time": "18:30",
                    "duration_minutes": 90,
                    "cost": 0.0,
                    "currency": "USD",
                    "location_name": "Positano Dock",
                    "latitude": 40.6288,
                    "longitude": 14.4862,
                    "transport_mode": "ferry",
                    "transport_details": "Included in day boat charter",
                    "order_index": 3,
                    "booking_verified": False
                }
            ]
        }
    ]
}

