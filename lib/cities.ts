/*
 * Indian cities for the city picker (waitlist and brand registration).
 * Format: "City|State|old or other names". All state and UT capitals, every city of about
 * 1 lakh people or more, and large district towns. People can still type a place that isn't
 * here: the picker keeps what they typed. Names follow current official spellings, so the
 * admin panel's city stats don't split "Bangalore" and "Bengaluru".
 */
const RAW = `
Port Blair|Andaman and Nicobar Islands|Sri Vijaya Puram
Visakhapatnam|Andhra Pradesh|Vizag,Vishakhapatnam
Vijayawada|Andhra Pradesh|Bezawada
Guntur|Andhra Pradesh|
Nellore|Andhra Pradesh|
Kurnool|Andhra Pradesh|
Rajahmundry|Andhra Pradesh|Rajamahendravaram
Tirupati|Andhra Pradesh|
Kakinada|Andhra Pradesh|
Kadapa|Andhra Pradesh|Cuddapah
Anantapur|Andhra Pradesh|Anantapuramu
Eluru|Andhra Pradesh|
Vizianagaram|Andhra Pradesh|
Ongole|Andhra Pradesh|
Nandyal|Andhra Pradesh|
Machilipatnam|Andhra Pradesh|Masulipatnam
Chittoor|Andhra Pradesh|
Srikakulam|Andhra Pradesh|
Tenali|Andhra Pradesh|
Proddatur|Andhra Pradesh|
Hindupur|Andhra Pradesh|
Bhimavaram|Andhra Pradesh|
Guntakal|Andhra Pradesh|
Dharmavaram|Andhra Pradesh|
Gudivada|Andhra Pradesh|
Narasaraopet|Andhra Pradesh|
Tadepalligudem|Andhra Pradesh|
Amaravati|Andhra Pradesh|
Madanapalle|Andhra Pradesh|
Chilakaluripet|Andhra Pradesh|
Itanagar|Arunachal Pradesh|
Naharlagun|Arunachal Pradesh|
Pasighat|Arunachal Pradesh|
Guwahati|Assam|Gauhati
Dispur|Assam|
Silchar|Assam|
Dibrugarh|Assam|
Jorhat|Assam|
Nagaon|Assam|Nowgong
Tinsukia|Assam|
Tezpur|Assam|
Bongaigaon|Assam|
Dhubri|Assam|
Diphu|Assam|
North Lakhimpur|Assam|
Karimganj|Assam|Sribhumi
Sivasagar|Assam|Sibsagar
Goalpara|Assam|
Barpeta|Assam|
Patna|Bihar|
Gaya|Bihar|
Bhagalpur|Bihar|
Muzaffarpur|Bihar|
Darbhanga|Bihar|
Purnia|Bihar|Purnea
Arrah|Bihar|Ara
Begusarai|Bihar|
Katihar|Bihar|
Munger|Bihar|Monghyr
Chhapra|Bihar|Chapra
Bihar Sharif|Bihar|Biharsharif
Sasaram|Bihar|
Hajipur|Bihar|
Dehri|Bihar|Dehri on Sone
Siwan|Bihar|
Motihari|Bihar|
Nawada|Bihar|
Bagaha|Bihar|
Buxar|Bihar|
Kishanganj|Bihar|
Sitamarhi|Bihar|
Jamalpur|Bihar|
Jehanabad|Bihar|
Aurangabad|Bihar|
Bettiah|Bihar|
Samastipur|Bihar|
Madhubani|Bihar|
Saharsa|Bihar|
Chandigarh|Chandigarh|
Raipur|Chhattisgarh|
Bhilai|Chhattisgarh|
Bilaspur|Chhattisgarh|
Korba|Chhattisgarh|
Durg|Chhattisgarh|
Rajnandgaon|Chhattisgarh|
Raigarh|Chhattisgarh|
Jagdalpur|Chhattisgarh|
Ambikapur|Chhattisgarh|
Chirmiri|Chhattisgarh|
Dhamtari|Chhattisgarh|
Mahasamund|Chhattisgarh|
Naya Raipur|Chhattisgarh|Atal Nagar,Nava Raipur
Silvassa|Dadra and Nagar Haveli and Daman and Diu|
Daman|Dadra and Nagar Haveli and Daman and Diu|
Diu|Dadra and Nagar Haveli and Daman and Diu|
New Delhi|Delhi|
Delhi|Delhi|Dilli,NCR
Dwarka|Delhi|
Rohini|Delhi|
Panaji|Goa|Panjim
Margao|Goa|Madgaon
Vasco da Gama|Goa|Vasco
Mapusa|Goa|
Ponda|Goa|
Ahmedabad|Gujarat|Amdavad
Surat|Gujarat|
Vadodara|Gujarat|Baroda
Rajkot|Gujarat|
Bhavnagar|Gujarat|
Jamnagar|Gujarat|
Gandhinagar|Gujarat|
Junagadh|Gujarat|
Gandhidham|Gujarat|
Anand|Gujarat|
Navsari|Gujarat|
Morbi|Gujarat|Morvi
Nadiad|Gujarat|
Surendranagar|Gujarat|
Bharuch|Gujarat|Broach
Mehsana|Gujarat|Mahesana
Bhuj|Gujarat|
Porbandar|Gujarat|
Palanpur|Gujarat|
Valsad|Gujarat|
Vapi|Gujarat|
Gondal|Gujarat|
Veraval|Gujarat|
Godhra|Gujarat|
Patan|Gujarat|
Kalol|Gujarat|
Dahod|Gujarat|
Botad|Gujarat|
Amreli|Gujarat|
Deesa|Gujarat|
Jetpur|Gujarat|
Ankleshwar|Gujarat|
Faridabad|Haryana|
Gurugram|Haryana|Gurgaon
Panipat|Haryana|
Ambala|Haryana|
Yamunanagar|Haryana|Yamuna Nagar
Rohtak|Haryana|
Hisar|Haryana|Hissar
Karnal|Haryana|
Sonipat|Haryana|Sonepat
Panchkula|Haryana|
Bhiwani|Haryana|
Sirsa|Haryana|
Bahadurgarh|Haryana|
Jind|Haryana|
Thanesar|Haryana|Kurukshetra
Kaithal|Haryana|
Rewari|Haryana|
Palwal|Haryana|
Hansi|Haryana|
Narnaul|Haryana|
Fatehabad|Haryana|
Manesar|Haryana|
Shimla|Himachal Pradesh|Simla
Dharamshala|Himachal Pradesh|Dharamsala
Mandi|Himachal Pradesh|
Solan|Himachal Pradesh|
Kullu|Himachal Pradesh|
Manali|Himachal Pradesh|
Hamirpur|Himachal Pradesh|
Una|Himachal Pradesh|
Baddi|Himachal Pradesh|
Palampur|Himachal Pradesh|
Srinagar|Jammu and Kashmir|
Jammu|Jammu and Kashmir|
Anantnag|Jammu and Kashmir|
Baramulla|Jammu and Kashmir|
Sopore|Jammu and Kashmir|
Kathua|Jammu and Kashmir|
Udhampur|Jammu and Kashmir|
Ranchi|Jharkhand|
Jamshedpur|Jharkhand|Tatanagar
Dhanbad|Jharkhand|
Bokaro|Jharkhand|Bokaro Steel City
Deoghar|Jharkhand|
Hazaribagh|Jharkhand|
Giridih|Jharkhand|
Ramgarh|Jharkhand|
Phusro|Jharkhand|
Medininagar|Jharkhand|Daltonganj
Chirkunda|Jharkhand|
Dumka|Jharkhand|
Chaibasa|Jharkhand|
Bengaluru|Karnataka|Bangalore
Mysuru|Karnataka|Mysore
Hubballi|Karnataka|Hubli,Hubli-Dharwad
Dharwad|Karnataka|
Mangaluru|Karnataka|Mangalore
Belagavi|Karnataka|Belgaum
Kalaburagi|Karnataka|Gulbarga
Davanagere|Karnataka|Davangere
Ballari|Karnataka|Bellary
Vijayapura|Karnataka|Bijapur
Shivamogga|Karnataka|Shimoga
Tumakuru|Karnataka|Tumkur
Raichur|Karnataka|
Bidar|Karnataka|
Hosapete|Karnataka|Hospet
Gadag|Karnataka|Gadag-Betageri
Udupi|Karnataka|Manipal
Hassan|Karnataka|
Chitradurga|Karnataka|
Kolar|Karnataka|
Mandya|Karnataka|
Chikkamagaluru|Karnataka|Chikmagalur
Bagalkot|Karnataka|
Gangavathi|Karnataka|
Robertsonpet|Karnataka|Kolar Gold Fields,KGF
Ranebennur|Karnataka|
Bhadravati|Karnataka|
Karwar|Karnataka|
Hosur|Tamil Nadu|
Thiruvananthapuram|Kerala|Trivandrum
Kochi|Kerala|Cochin,Ernakulam
Kozhikode|Kerala|Calicut
Thrissur|Kerala|Trichur
Kollam|Kerala|Quilon
Kannur|Kerala|Cannanore
Alappuzha|Kerala|Alleppey
Palakkad|Kerala|Palghat
Kottayam|Kerala|
Malappuram|Kerala|
Kasaragod|Kerala|
Pathanamthitta|Kerala|
Thalassery|Kerala|Tellicherry
Kayamkulam|Kerala|
Ponnani|Kerala|
Vadakara|Kerala|Badagara
Thodupuzha|Kerala|
Kalpetta|Kerala|Wayanad
Munnar|Kerala|
Leh|Ladakh|
Kargil|Ladakh|
Kavaratti|Lakshadweep|
Indore|Madhya Pradesh|
Bhopal|Madhya Pradesh|
Jabalpur|Madhya Pradesh|
Gwalior|Madhya Pradesh|
Ujjain|Madhya Pradesh|
Sagar|Madhya Pradesh|Saugor
Dewas|Madhya Pradesh|
Satna|Madhya Pradesh|
Ratlam|Madhya Pradesh|
Rewa|Madhya Pradesh|
Murwara|Madhya Pradesh|Katni
Singrauli|Madhya Pradesh|
Burhanpur|Madhya Pradesh|
Khandwa|Madhya Pradesh|
Bhind|Madhya Pradesh|
Chhindwara|Madhya Pradesh|
Guna|Madhya Pradesh|
Shivpuri|Madhya Pradesh|
Vidisha|Madhya Pradesh|
Chhatarpur|Madhya Pradesh|
Damoh|Madhya Pradesh|
Mandsaur|Madhya Pradesh|
Khargone|Madhya Pradesh|
Neemuch|Madhya Pradesh|
Pithampur|Madhya Pradesh|
Hoshangabad|Madhya Pradesh|Narmadapuram
Itarsi|Madhya Pradesh|
Sehore|Madhya Pradesh|
Betul|Madhya Pradesh|
Seoni|Madhya Pradesh|
Datia|Madhya Pradesh|
Morena|Madhya Pradesh|
Mumbai|Maharashtra|Bombay
Pune|Maharashtra|Poona
Nagpur|Maharashtra|
Thane|Maharashtra|
Navi Mumbai|Maharashtra|New Bombay
Pimpri-Chinchwad|Maharashtra|PCMC,Pimpri,Chinchwad
Nashik|Maharashtra|Nasik
Kalyan|Maharashtra|Kalyan-Dombivli
Dombivli|Maharashtra|
Vasai-Virar|Maharashtra|Vasai,Virar
Chhatrapati Sambhajinagar|Maharashtra|Aurangabad
Solapur|Maharashtra|Sholapur
Mira-Bhayandar|Maharashtra|Mira Road,Bhayandar
Bhiwandi|Maharashtra|
Amravati|Maharashtra|
Kolhapur|Maharashtra|
Sangli|Maharashtra|Sangli-Miraj
Malegaon|Maharashtra|
Ulhasnagar|Maharashtra|
Jalgaon|Maharashtra|
Akola|Maharashtra|
Latur|Maharashtra|
Dhule|Maharashtra|
Ahilyanagar|Maharashtra|Ahmednagar
Chandrapur|Maharashtra|
Parbhani|Maharashtra|
Ichalkaranji|Maharashtra|
Jalna|Maharashtra|
Ambarnath|Maharashtra|
Bhusawal|Maharashtra|
Panvel|Maharashtra|
Badlapur|Maharashtra|
Beed|Maharashtra|Bid
Gondia|Maharashtra|Gondiya
Satara|Maharashtra|
Barshi|Maharashtra|
Yavatmal|Maharashtra|
Achalpur|Maharashtra|
Dharashiv|Maharashtra|Osmanabad
Nanded|Maharashtra|
Wardha|Maharashtra|
Udgir|Maharashtra|
Hinganghat|Maharashtra|
Ratnagiri|Maharashtra|
Lonavala|Maharashtra|
Baramati|Maharashtra|
Alibag|Maharashtra|Alibaug
Palghar|Maharashtra|
Imphal|Manipur|
Thoubal|Manipur|
Churachandpur|Manipur|
Shillong|Meghalaya|
Tura|Meghalaya|
Jowai|Meghalaya|
Aizawl|Mizoram|
Lunglei|Mizoram|
Kohima|Nagaland|
Dimapur|Nagaland|Chumoukedima
Mokokchung|Nagaland|
Bhubaneswar|Odisha|Bhubaneshwar
Cuttack|Odisha|
Rourkela|Odisha|Raurkela
Berhampur|Odisha|Brahmapur
Sambalpur|Odisha|
Puri|Odisha|
Balasore|Odisha|Baleshwar
Bhadrak|Odisha|
Baripada|Odisha|
Jharsuguda|Odisha|
Jeypore|Odisha|
Bargarh|Odisha|
Angul|Odisha|
Rayagada|Odisha|
Balangir|Odisha|Bolangir
Kendrapara|Odisha|
Paradip|Odisha|
Puducherry|Puducherry|Pondicherry,Pondy
Karaikal|Puducherry|
Yanam|Puducherry|
Mahe|Puducherry|
Ludhiana|Punjab|
Amritsar|Punjab|
Jalandhar|Punjab|Jullundur
Patiala|Punjab|
Bathinda|Punjab|Bhatinda
Mohali|Punjab|Sahibzada Ajit Singh Nagar,SAS Nagar
Hoshiarpur|Punjab|
Pathankot|Punjab|
Moga|Punjab|
Batala|Punjab|
Abohar|Punjab|
Malerkotla|Punjab|
Khanna|Punjab|
Phagwara|Punjab|
Muktsar|Punjab|Sri Muktsar Sahib
Barnala|Punjab|
Rajpura|Punjab|
Firozpur|Punjab|Ferozepur
Kapurthala|Punjab|
Sangrur|Punjab|
Zirakpur|Punjab|
Fazilka|Punjab|
Jaipur|Rajasthan|Pink City
Jodhpur|Rajasthan|
Kota|Rajasthan|
Bikaner|Rajasthan|
Ajmer|Rajasthan|
Udaipur|Rajasthan|
Bhilwara|Rajasthan|
Alwar|Rajasthan|
Bharatpur|Rajasthan|
Sikar|Rajasthan|
Pali|Rajasthan|
Sri Ganganagar|Rajasthan|Ganganagar
Kishangarh|Rajasthan|
Tonk|Rajasthan|
Beawar|Rajasthan|
Hanumangarh|Rajasthan|
Dhaulpur|Rajasthan|Dholpur
Gangapur City|Rajasthan|
Sawai Madhopur|Rajasthan|
Churu|Rajasthan|
Jhunjhunu|Rajasthan|
Baran|Rajasthan|
Chittorgarh|Rajasthan|Chittaurgarh
Banswara|Rajasthan|
Bundi|Rajasthan|
Nagaur|Rajasthan|
Jaisalmer|Rajasthan|
Barmer|Rajasthan|
Bhiwadi|Rajasthan|
Mount Abu|Rajasthan|
Pushkar|Rajasthan|
Gangtok|Sikkim|
Namchi|Sikkim|
Chennai|Tamil Nadu|Madras
Coimbatore|Tamil Nadu|Kovai
Madurai|Tamil Nadu|
Tiruchirappalli|Tamil Nadu|Trichy,Tiruchi
Salem|Tamil Nadu|
Tirunelveli|Tamil Nadu|
Tiruppur|Tamil Nadu|Tirupur
Vellore|Tamil Nadu|
Erode|Tamil Nadu|
Thoothukudi|Tamil Nadu|Tuticorin
Dindigul|Tamil Nadu|
Thanjavur|Tamil Nadu|Tanjore
Ranipet|Tamil Nadu|
Sivakasi|Tamil Nadu|
Karur|Tamil Nadu|
Udhagamandalam|Tamil Nadu|Ooty
Kanchipuram|Tamil Nadu|Kancheepuram
Kumbakonam|Tamil Nadu|
Nagercoil|Tamil Nadu|
Cuddalore|Tamil Nadu|
Tiruvannamalai|Tamil Nadu|
Pollachi|Tamil Nadu|
Rajapalayam|Tamil Nadu|
Pudukkottai|Tamil Nadu|Pudukottai
Nagapattinam|Tamil Nadu|
Viluppuram|Tamil Nadu|Villupuram
Ambur|Tamil Nadu|
Karaikudi|Tamil Nadu|
Neyveli|Tamil Nadu|
Tambaram|Tamil Nadu|
Avadi|Tamil Nadu|
Chengalpattu|Tamil Nadu|Chengalpet
Kodaikanal|Tamil Nadu|
Namakkal|Tamil Nadu|
Krishnagiri|Tamil Nadu|
Hyderabad|Telangana|Bhagyanagar
Secunderabad|Telangana|
Warangal|Telangana|
Nizamabad|Telangana|
Karimnagar|Telangana|
Khammam|Telangana|
Ramagundam|Telangana|
Mahbubnagar|Telangana|Mahabubnagar
Nalgonda|Telangana|
Adilabad|Telangana|
Siddipet|Telangana|
Suryapet|Telangana|
Miryalaguda|Telangana|
Mancherial|Telangana|
Kothagudem|Telangana|
Jagtial|Telangana|
Sangareddy|Telangana|
Agartala|Tripura|
Udaipur (Tripura)|Tripura|
Dharmanagar|Tripura|
Lucknow|Uttar Pradesh|
Kanpur|Uttar Pradesh|Cawnpore
Ghaziabad|Uttar Pradesh|
Agra|Uttar Pradesh|
Varanasi|Uttar Pradesh|Banaras,Benares,Kashi
Meerut|Uttar Pradesh|
Prayagraj|Uttar Pradesh|Allahabad
Noida|Uttar Pradesh|Gautam Buddh Nagar
Greater Noida|Uttar Pradesh|
Bareilly|Uttar Pradesh|
Aligarh|Uttar Pradesh|
Moradabad|Uttar Pradesh|
Saharanpur|Uttar Pradesh|
Gorakhpur|Uttar Pradesh|
Firozabad|Uttar Pradesh|
Jhansi|Uttar Pradesh|
Muzaffarnagar|Uttar Pradesh|
Mathura|Uttar Pradesh|
Vrindavan|Uttar Pradesh|
Ayodhya|Uttar Pradesh|Faizabad
Rampur|Uttar Pradesh|
Shahjahanpur|Uttar Pradesh|
Farrukhabad|Uttar Pradesh|
Mau|Uttar Pradesh|
Hapur|Uttar Pradesh|
Etawah|Uttar Pradesh|
Mirzapur|Uttar Pradesh|
Bulandshahr|Uttar Pradesh|
Sambhal|Uttar Pradesh|
Amroha|Uttar Pradesh|
Hardoi|Uttar Pradesh|
Fatehpur|Uttar Pradesh|
Raebareli|Uttar Pradesh|Rae Bareli
Orai|Uttar Pradesh|
Sitapur|Uttar Pradesh|
Bahraich|Uttar Pradesh|
Modinagar|Uttar Pradesh|
Unnao|Uttar Pradesh|
Jaunpur|Uttar Pradesh|
Lakhimpur|Uttar Pradesh|Lakhimpur Kheri
Hathras|Uttar Pradesh|
Banda|Uttar Pradesh|
Pilibhit|Uttar Pradesh|
Barabanki|Uttar Pradesh|
Khurja|Uttar Pradesh|
Gonda|Uttar Pradesh|
Mainpuri|Uttar Pradesh|
Lalitpur|Uttar Pradesh|
Etah|Uttar Pradesh|
Deoria|Uttar Pradesh|
Ballia|Uttar Pradesh|
Basti|Uttar Pradesh|
Azamgarh|Uttar Pradesh|
Sultanpur|Uttar Pradesh|
Ghazipur|Uttar Pradesh|
Budaun|Uttar Pradesh|Badaun
Shamli|Uttar Pradesh|
Baghpat|Uttar Pradesh|
Dehradun|Uttarakhand|Dehra Dun
Haridwar|Uttarakhand|Hardwar
Roorkee|Uttarakhand|
Haldwani|Uttarakhand|Haldwani-Kathgodam
Rudrapur|Uttarakhand|
Kashipur|Uttarakhand|
Rishikesh|Uttarakhand|
Nainital|Uttarakhand|
Mussoorie|Uttarakhand|
Almora|Uttarakhand|
Pithoragarh|Uttarakhand|
Kolkata|West Bengal|Calcutta
Howrah|West Bengal|Haora
Durgapur|West Bengal|
Asansol|West Bengal|
Siliguri|West Bengal|
Bardhaman|West Bengal|Burdwan
Kharagpur|West Bengal|
Haldia|West Bengal|
Bally|West Bengal|
Barasat|West Bengal|
Krishnanagar|West Bengal|
Malda|West Bengal|English Bazar
Baharampur|West Bengal|Berhampore
Habra|West Bengal|
Raiganj|West Bengal|
Jalpaiguri|West Bengal|
Darjeeling|West Bengal|Darjiling
Bankura|West Bengal|
Purulia|West Bengal|
Medinipur|West Bengal|Midnapore
Cooch Behar|West Bengal|Koch Bihar
Shantiniketan|West Bengal|Bolpur
Salt Lake|West Bengal|Bidhannagar
New Town|West Bengal|Rajarhat
Serampore|West Bengal|Shrirampur
Chandannagar|West Bengal|Chandernagore
Kalyani|West Bengal|
Barrackpore|West Bengal|
`;

export type City = { name: string; state: string; aka: string[] };

export const CITIES: City[] = RAW.trim().split("\n").map((line) => {
  const [name, state, aka = ""] = line.split("|");
  return { name, state, aka: aka.split(",").map((a) => a.trim()).filter(Boolean) };
});

/** Shown before the person types: the biggest metros. */
export const POPULAR = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Gurugram", "Noida", "Lucknow"];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/** Cities matching what the person typed: name starts-with first, then old names, then anywhere. */
export function searchCities(query: string, limit = 8): City[] {
  const q = norm(query);
  if (!q) return POPULAR.map((n) => CITIES.find((c) => c.name === n)!).filter(Boolean).slice(0, limit);
  const scored: [number, City][] = [];
  for (const c of CITIES) {
    const name = norm(c.name);
    const akas = c.aka.map(norm);
    let score = -1;
    if (name === q) score = 0;
    else if (name.startsWith(q)) score = 1;
    else if (akas.some((a) => a === q || a.startsWith(q))) score = 2;
    else if (name.split(" ").some((w) => w.startsWith(q))) score = 3;
    else if (name.includes(q) || norm(c.state).startsWith(q)) score = 4;
    if (score >= 0) scored.push([score, c]);
  }
  return scored.sort((a, b) => a[0] - b[0] || a[1].name.length - b[1].name.length).slice(0, limit).map(([, c]) => c);
}

/** The official name for something typed, if it's a known city or old name ("Bangalore" -> "Bengaluru"). */
export function canonicalCity(typed: string): string {
  const q = norm(typed);
  const hit = CITIES.find((c) => norm(c.name) === q) ?? CITIES.find((c) => c.aka.some((a) => norm(a) === q));
  return hit ? hit.name : typed.trim();
}
