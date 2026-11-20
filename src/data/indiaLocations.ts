// Pan-India Master Geographic Directory (28 States + 8 Union Territories)
// Enables Harit Rajasthan -> Harit Bharat cascading exploration:
// State -> District -> Sub-District / City / Tehsil -> Kasba / Town / Village

export interface IndiaStateDirectory {
  slug: string;
  nameEn: string;
  nameHi: string;
  districts: string[];
}

export const INDIA_STATES_DIRECTORY: IndiaStateDirectory[] = [
  {
    slug: 'rajasthan',
    nameEn: 'Rajasthan',
    nameHi: 'राजस्थान',
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer',
      'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh',
      'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu',
      'Dungarpur', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
      'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kekri',
      'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana',
      'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore',
      'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Sri Ganganagar',
      'Tonk', 'Udaipur',
    ],
  },
  {
    slug: 'gujarat',
    nameEn: 'Gujarat',
    nameHi: 'गुजरात',
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
      'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
      'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
      'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
      'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
      'Tapi', 'Vadodara', 'Valsad',
    ],
  },
  {
    slug: 'madhya-pradesh',
    nameEn: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
      'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
      'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Maihar',
      'Mandla', 'Mandsaur', 'Morena', 'Narmadapuram', 'Narsinghpur', 'Neemuch',
      'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
      'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi',
      'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha',
    ],
  },
  {
    slug: 'uttar-pradesh',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
      'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur',
      'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun',
      'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah',
      'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
      'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
      'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar',
      'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur',
      'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut',
      'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
      'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
      'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur',
      'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi',
    ],
  },
  {
    slug: 'haryana',
    nameEn: 'Haryana',
    nameHi: 'हरियाणा',
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra',
      'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari',
      'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
    ],
  },
  {
    slug: 'punjab',
    nameEn: 'Punjab',
    nameHi: 'पंजाब',
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
      'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala',
      'Ludhiana', 'Malerkotla', 'Mansa', 'Moga', 'Mohali', 'Muktsar',
      'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Shaheed Bhagat Singh Nagar',
      'Tarn Taran',
    ],
  },
  {
    slug: 'maharashtra',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana',
      'Chandrapur', 'Chhatrapati Sambhajinagar', 'Dharashiv', 'Dhule',
      'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
      'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar',
      'Nashik', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli',
      'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
    ],
  },
  {
    slug: 'delhi',
    nameEn: 'Delhi (NCT)',
    nameHi: 'दिल्ली (NCT)',
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi',
      'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi',
      'South East Delhi', 'South West Delhi', 'West Delhi',
    ],
  },
  {
    slug: 'uttarakhand',
    nameEn: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal',
      'Udham Singh Nagar', 'Uttarkashi',
    ],
  },
  {
    slug: 'himachal-pradesh',
    nameEn: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu',
      'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una',
    ],
  },
  {
    slug: 'bihar',
    nameEn: 'Bihar',
    nameHi: 'बिहार',
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
      'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj',
      'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj',
      'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda',
      'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran',
      'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali',
      'West Champaran',
    ],
  },
  {
    slug: 'jharkhand',
    nameEn: 'Jharkhand',
    nameHi: 'झारखंड',
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti',
      'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
      'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum',
    ],
  },
  {
    slug: 'chhattisgarh',
    nameEn: 'Chhattisgarh',
    nameHi: 'छत्तीसगढ़',
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
      'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa',
      'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya',
      'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon',
      'Sukma', 'Surajpur', 'Surguja',
    ],
  },
  {
    slug: 'west-bengal',
    nameEn: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
      'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong',
      'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
      'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman',
      'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
    ],
  },
  {
    slug: 'odisha',
    nameEn: 'Odisha',
    nameHi: 'ओडिशा',
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
      'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur',
      'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha',
      'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
      'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh',
    ],
  },
  {
    slug: 'karnataka',
    nameEn: 'Karnataka',
    nameHi: 'कर्नाटक',
    districts: [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
      'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
      'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
      'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
      'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
      'Vijayanagara', 'Vijayapura', 'Yadgir',
    ],
  },
  {
    slug: 'tamil-nadu',
    nameEn: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
      'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
      'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
      'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
      'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
      'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
      'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
      'Viluppuram', 'Virudhunagar',
    ],
  },
  {
    slug: 'kerala',
    nameEn: 'Kerala',
    nameHi: 'केरल',
    districts: [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
      'Thiruvananthapuram', 'Thrissur', 'Wayanad',
    ],
  },
  {
    slug: 'andhra-pradesh',
    nameEn: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya',
      'Bapatla', 'Chittoor', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada',
      'Konaseema', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore',
      'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam',
      'Vizianagaram', 'West Godavari', 'YSR Kadapa',
    ],
  },
  {
    slug: 'telangana',
    nameEn: 'Telangana',
    nameHi: 'तेलंगाना',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
      'Karimnagar', 'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahabubnagar',
      'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
      'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
      'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet',
      'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri',
    ],
  },
  {
    slug: 'assam',
    nameEn: 'Assam',
    nameHi: 'असम',
    districts: [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo',
      'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao',
      'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup',
      'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
      'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
      'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri',
      'West Karbi Anglong',
    ],
  },
  {
    slug: 'goa',
    nameEn: 'Goa',
    nameHi: 'गोवा',
    districts: ['North Goa', 'South Goa'],
  },
  {
    slug: 'arunachal-pradesh',
    nameEn: 'Arunachal Pradesh',
    nameHi: 'अरुणाचल प्रदेश',
    districts: ['Itanagar Capital Complex', 'Papum Pare', 'Tawang', 'West Kameng', 'East Siang', 'Changlang', 'Lohit'],
  },
  {
    slug: 'manipur',
    nameEn: 'Manipur',
    nameHi: 'मणिपुर',
    districts: ['Imphal East', 'Imphal West', 'Bishnupur', 'Thoubal', 'Churachandpur', 'Ukhrul', 'Senapati'],
  },
  {
    slug: 'meghalaya',
    nameEn: 'Meghalaya',
    nameHi: 'मेघालय',
    districts: ['East Khasi Hills', 'West Khasi Hills', 'Ri-Bhoi', 'West Garo Hills', 'East Garo Hills', 'West Jaintia Hills'],
  },
  {
    slug: 'mizoram',
    nameEn: 'Mizoram',
    nameHi: 'मिज़ोरम',
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai'],
  },
  {
    slug: 'nagaland',
    nameEn: 'Nagaland',
    nameHi: 'नागालैंड',
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Mon', 'Tuensang', 'Wokha', 'Zunheboto'],
  },
  {
    slug: 'sikkim',
    nameEn: 'Sikkim',
    nameHi: 'सिक्किम',
    districts: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'],
  },
  {
    slug: 'tripura',
    nameEn: 'Tripura',
    nameHi: 'त्रिपुरा',
    districts: ['West Tripura', 'South Tripura', 'North Tripura', 'Dhalai', 'Gomati', 'Khowai', 'Sepahijala', 'Unakoti'],
  },
  {
    slug: 'jammu-and-kashmir',
    nameEn: 'Jammu & Kashmir (UT)',
    nameHi: 'जम्मू और कश्मीर (UT)',
    districts: ['Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Budgam', 'Kathua', 'Kupwara', 'Pulwama', 'Rajouri', 'Samba', 'Udhampur'],
  },
  {
    slug: 'ladakh',
    nameEn: 'Ladakh (UT)',
    nameHi: 'लद्दाख (UT)',
    districts: ['Leh', 'Kargil'],
  },
  {
    slug: 'chandigarh',
    nameEn: 'Chandigarh (UT)',
    nameHi: 'चंडीगढ़ (UT)',
    districts: ['Chandigarh'],
  },
  {
    slug: 'puducherry',
    nameEn: 'Puducherry (UT)',
    nameHi: 'पुदुचेरी (UT)',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
  {
    slug: 'andaman-and-nicobar',
    nameEn: 'Andaman & Nicobar Islands (UT)',
    nameHi: 'अंडमान और निकोबार (UT)',
    districts: ['South Andaman', 'North and Middle Andaman', 'Nicobar'],
  },
  {
    slug: 'dadra-nagar-haveli-daman-diu',
    nameEn: 'Dadra & Nagar Haveli and Daman & Diu (UT)',
    nameHi: 'दादरा व नगर हवेली तथा दमन व दीव (UT)',
    districts: ['Dadra & Nagar Haveli', 'Daman', 'Diu'],
  },
  {
    slug: 'lakshadweep',
    nameEn: 'Lakshadweep (UT)',
    nameHi: 'लक्षद्वीप (UT)',
    districts: ['Lakshadweep'],
  },
];

// Preset City / Tehsil / Block -> Gram Panchayat / Village / Municipal Ward clusters
// Additional Cities, Tehsils, Grams & Wards added in Admin automatically merge into these dropdowns!
export interface SubDistrictLocationGroup {
  name: string;
  villages: string[];
}

export const PRESET_SUBDISTRICTS: Record<string, SubDistrictLocationGroup[]> = {
  Bhilwara: [
    { name: 'Bhilwara City / Suwana', villages: ['Azad Chowk Market & Pratap Nagar', 'Ward 1–10 Urban Green Belt', 'Suwana', 'Hamirgarh', 'Pur', 'Sanganer', 'Biliya'] },
    { name: 'Mandalgarh', villages: ['Mandalgarh Kasba', 'Bigod', 'Bijoliya', 'Kachhola', 'Shyampura', 'Triveni', 'Mandalgarh Gram Panchayat Cluster'] },
    { name: 'Mandal', villages: ['Mandal', 'Bagor', 'Bhadali Khera', 'Meja', 'Bhagwanpura'] },
    { name: 'Asind', villages: ['Asind', 'Badnor', 'Shambhugarh', 'Kareda', 'Antali'] },
    { name: 'Sahada / Gangapur', villages: ['Gangapur', 'Raipur', 'Potlan', 'Koshithal', 'Sahada'] },
    { name: 'Jahazpur', villages: ['Jahazpur Kasba', 'Pander', 'Piplund', 'Luhari Kalan'] },
    { name: 'Kotri', villages: ['Kotri', 'Banera', 'Sawai Pur', 'Paroli'] },
  ],
  Shahpura: [
    { name: 'Shahpura City', villages: ['Shahpura Ward 1–10', 'Shahpura Rural Block', 'Phuliya Kalan', 'Dhikola'] },
    { name: 'Jahazpur / Kotri Belt', villages: ['Khamor', 'Dhanop', 'Borda'] },
  ],
  Churu: [
    { name: 'Sardarshahar', villages: ['Thathawata', 'Sardarshahar Ward 4', 'Gharsisar', 'Sardarshahar Kasba', 'Bhanipura', 'Bidasar Road', 'Malsar', 'Bhojasar'] },
    { name: 'Churu City / Tehsil', villages: ['Churu Urban Ward 1–15', 'Ratan Nagar', 'Dudhwakhara', 'Khasoli', 'Satyun'] },
    { name: 'Ratangarh', villages: ['Ratangarh City', 'Rajaldesar', 'Loha', 'Parihara', 'Tidiyasar'] },
    { name: 'Sujangarh', villages: ['Sujangarh City', 'Salasar', 'Bidasar', 'Chhapar', 'Sandwa'] },
    { name: 'Taranagar', villages: ['Taranagar Kasba', 'Sahawa', 'Bhaleri', 'Bhalau'] },
    { name: 'Rajgarh / Sadulpur', villages: ['Sadulpur City', 'Sidhmukh', 'Hameerwas', 'Sankhoo'] },
  ],
  Bikaner: [
    { name: 'Bikaner City', villages: ['Bikaner Urban Ward 1–20', 'Deshnoke', 'Napasar', 'Udasar', 'Ganga Shahar', 'Ridmalsar'] },
    { name: 'Nokha', villages: ['Nokha Mandi', 'Jasrasar', 'Panchu', 'Sovaniya', 'Himmatsar'] },
    { name: 'Lunkaransar', villages: ['Lunkaransar Kasba', 'Mahajan', 'Kalu', 'Khinyeera'] },
    { name: 'Kolayat', villages: ['Kolayat', 'Gajner', 'Bajaj Nagar', 'Bajju', 'Hadda'] },
    { name: 'Sri Dungargarh', villages: ['Sri Dungargarh City', 'Sheruna', 'Bigha', 'Soodsar'] },
    { name: 'Khajuwala', villages: ['Khajuwala Mandi', 'Chhatargarh', 'Pugal', 'Dantor'] },
  ],
  Phalodi: [
    { name: 'Phalodi City / Tehsil', villages: ['Phalodi Kasba Ward 1–10', 'Khichan', 'Malar', 'Bhojasar', 'Kundal'] },
    { name: 'Lohawat', villages: ['Lohawat', 'Peelwa', 'Jamba', 'Dechu', 'Chhila'] },
    { name: 'Bap', villages: ['Bap Kasba', 'Ghatiyali', 'Bhadla', 'Shekhasar'] },
    { name: 'Aau', villages: ['Aau', 'Chadi', 'Ishru', 'Dhadhu'] },
    { name: 'Setrawa / Bapini', villages: ['Bapini', 'Setrawa', 'Matora'] },
  ],
  Jodhpur: [
    { name: 'Jodhpur City / Mandore', villages: ['Jodhpur Urban Ward 1–25', 'Mandore School Cluster', 'Mandore', 'Banar', 'Daijar', 'Salawas', 'Kudi Bhagtasni'] },
    { name: 'Osian', villages: ['Osian Kasba', 'Tinwari', 'Mathania', 'Khetasar', 'Cherai'] },
    { name: 'Bilara', villages: ['Bilara City', 'Pipar City', 'Borunda', 'Bhopalgarh', 'Khejarla'] },
    { name: 'Luni', villages: ['Luni', 'Dhawa', 'Jhanwar', 'Khejarli', 'Guda Bishnoiyan'] },
    { name: 'Shergarh', villages: ['Shergarh', 'Balesar', 'Tena', 'Somesar'] },
  ],
  Jaipur: [
    { name: 'Jaipur City', villages: ['Jaipur Municipal Ward 1–25', 'Sanganer', 'Amber', 'Jhotwara', 'Mansarovar'] },
    { name: 'Chomu', villages: ['Chomu City', 'Samod', 'Govindgarh', 'Kaladera'] },
    { name: 'Bassi', villages: ['Bassi', 'Toonga', 'Kanota', 'Jatwara'] },
    { name: 'Chaksu', villages: ['Chaksu Kasba', 'Kotkhawda', 'Shivdaspura'] },
  ],
  Sikar: [
    { name: 'Sikar City / Tehsil', villages: ['Sikar Urban Ward 1–15', 'Piprali', 'Dhod', 'Katrathal'] },
    { name: 'Fatehpur / Laxmangarh', villages: ['Fatehpur Shekhawati', 'Laxmangarh', 'Ramgarh Shekhawati'] },
    { name: 'Danta Ramgarh / Khatu', villages: ['Khatu Shyamji', 'Danta', 'Palsana', 'Reengus'] },
  ],
  Ajmer: [
    { name: 'Ajmer City', villages: ['Ajmer Ward 1–20', 'Pushkar', 'Gegal', 'Makhupura'] },
    { name: 'Kishangarh', villages: ['Kishangarh City', 'Roopangarh', 'Harmara', 'Sursura'] },
    { name: 'Nasirabad', villages: ['Nasirabad', 'Srinagar', 'Bhinai'] },
  ],
  Udaipur: [
    { name: 'Udaipur City / Girwa', villages: ['Udaipur Urban Ward 1–20', 'Badgaon', 'Debari', 'Bhuwana'] },
    { name: 'Mavli', villages: ['Mavli', 'Dabok', 'Fatehnagar', 'Sanwar'] },
    { name: 'Gogunda / Vallabhnagar', villages: ['Gogunda', 'Vallabhnagar', 'Bhinder', 'Kanore'] },
  ],
  Kota: [
    { name: 'Kota City / Ladpura', villages: ['Kota Urban Ward 1–20', 'Kaithoon', 'Mandana', 'Rangbari'] },
    { name: 'Ramganj Mandi', villages: ['Ramganj Mandi', 'Chechat', 'Modak'] },
    { name: 'Sangod / Pipalda', villages: ['Sangod', 'Itawa', 'Sultanpur'] },
  ],
  Alwar: [
    { name: 'Alwar City', villages: ['Alwar Urban Ward 1–15', 'Malakhera', 'Umrain', 'Ramgarh'] },
    { name: 'Rajgarh / Thanagazi', villages: ['Rajgarh', 'Thanagazi', 'Pratapgarh'] },
  ],
  Nagaur: [
    { name: 'Nagaur City', villages: ['Nagaur Ward 1–15', 'Mundwa', 'Khinwsar', 'Jayal'] },
    { name: 'Merta City', villages: ['Merta City', 'Merta Road', 'Degana', 'Riyan Badi'] },
  ],
  Pali: [
    { name: 'Pali City', villages: ['Pali Urban Ward 1–15', 'Rohat', 'Sojat', 'Marwar Junction'] },
    { name: 'Sumerpur / Bali', villages: ['Sumerpur', 'Falna', 'Bali', 'Desuri'] },
  ],
  Jhunjhunu: [
    { name: 'Jhunjhunu City', villages: ['Jhunjhunu Urban Ward 1–15', 'Mandawa', 'Baggar', 'Bissau'] },
    { name: 'Nawalgarh / Pilani', villages: ['Nawalgarh', 'Pilani', 'Chirawa', 'Surajgarh'] },
  ],
  Hanumangarh: [
    { name: 'Hanumangarh Junction & Town', villages: ['Hanumangarh Urban Ward 1–15', 'Tibbi', 'Pilibanga'] },
    { name: 'Nohar / Bhadra', villages: ['Nohar', 'Bhadra', 'Rawatsar', 'Sangaria'] },
  ],
  'Sri Ganganagar': [
    { name: 'Sri Ganganagar City', villages: ['Sri Ganganagar Ward 1–15', 'Sadulshahar', 'Padampur'] },
    { name: 'Suratgarh / Raisinghnagar', villages: ['Suratgarh', 'Raisinghnagar', 'Sri Karanpur'] },
  ],
  Chittorgarh: [
    { name: 'Chittorgarh City', villages: ['Chittorgarh Urban Ward 1–15', 'Bassi', 'Gangrar'] },
    { name: 'Nimbahera / Kapasan', villages: ['Nimbahera', 'Kapasan', 'Begun', 'Rawatbhata'] },
  ],
  Kutch: [
    { name: 'Bhuj', villages: ['Bhuj City Ward 1–10', 'Madhapar', 'Mirzapar', 'Kukma'] },
    { name: 'Anjar / Gandhidham', villages: ['Anjar', 'Gandhidham', 'Adipur', 'Mundra'] },
  ],
  Ahmedabad: [
    { name: 'Ahmedabad City', villages: ['Navrangpura Ward', 'Bopal', 'Sanand', 'Dholka'] },
    { name: 'Daskroi / Viramgam', villages: ['Daskroi', 'Viramgam', 'Bavla'] },
  ],
  Indore: [
    { name: 'Indore City', villages: ['Indore Municipal Ward 1–15', 'Rau', 'Mhow', 'Sanwer'] },
    { name: 'Depalpur', villages: ['Depalpur', 'Betma', 'Gautampura'] },
  ],
  Lucknow: [
    { name: 'Lucknow City', villages: ['Gomti Nagar Ward', 'Alambagh', 'Bakshi Ka Talab', 'Mohanlalganj'] },
    { name: 'Malihabad', villages: ['Malihabad', 'Kakori', 'Rahimabad'] },
  ],
  Shimla: [
    { name: 'Shimla City', villages: ['Shimla Municipal Ward 1–10', 'Mashobra', 'Kufri', 'Sanjauli'] },
    { name: 'Theog / Rohru', villages: ['Theog', 'Kotkhai', 'Rohru', 'Jubbal'] },
  ],
};

/**
 * Returns cascading City / Tehsil -> Grams & Wards groups for any Indian district.
 * Automatically merges curated presets with any custom Admin-defined cities/villages,
 * and falls back gracefully so every district offers selectable City/Block + Gram/Ward options.
 */
export function getCitiesAndGramsForDistrict(
  districtName: string,
  extraCities: string[] = [],
  extraLocalities: string[] = []
): SubDistrictLocationGroup[] {
  const cleanDistrict = districtName.trim();
  if (!cleanDistrict) return [];

  const presetKey = Object.keys(PRESET_SUBDISTRICTS).find(
    (k) => k.toLowerCase() === cleanDistrict.toLowerCase()
  );

  const map = new Map<string, Set<string>>();

  if (presetKey) {
    for (const grp of PRESET_SUBDISTRICTS[presetKey]) {
      map.set(grp.name, new Set(grp.villages));
    }
  } else {
    // Graceful universal structure for any of India's 700+ districts not yet detailed in presets
    map.set(
      `${cleanDistrict} City / Municipal Area`,
      new Set([
        `${cleanDistrict} Urban Ward 1–5`,
        `${cleanDistrict} Urban Ward 6–10`,
        `${cleanDistrict} Town Market Area`,
      ])
    );
    map.set(
      `${cleanDistrict} Rural Tehsil / Block`,
      new Set([
        `${cleanDistrict} Gram Panchayat Cluster`,
        `${cleanDistrict} Rural Village Belt`,
      ])
    );
  }

  for (const c of extraCities) {
    const trimmed = c.trim();
    if (!trimmed) continue;
    const existingKey = Array.from(map.keys()).find(
      (k) => k.toLowerCase() === trimmed.toLowerCase()
    );
    if (!existingKey) {
      map.set(trimmed, new Set([`${trimmed} Town / Ward`, `${trimmed} Gram Panchayat`]));
    }
  }

  // Merge any extra admin-assigned localities into a matching city or the first city group
  const firstKey = Array.from(map.keys())[0];
  for (const loc of extraLocalities) {
    const trimmed = loc.trim();
    if (!trimmed) continue;
    const matchedCity = Array.from(map.keys()).find((cityKey) => {
      const ck = cityKey.toLowerCase();
      const lt = trimmed.toLowerCase();
      return lt.includes(ck) || ck.includes(lt);
    });
    const targetKey = matchedCity ?? firstKey;
    if (targetKey) {
      map.get(targetKey)?.add(trimmed);
    }
  }

  return Array.from(map.entries()).map(([name, set]) => ({
    name,
    villages: Array.from(set),
  }));
}

export const ADVISORY_DOMAIN_CATEGORIES = [
  {
    id: 'environment-climate',
    hi: 'पर्यावरण एवं जलवायु परिवर्तन सलाहकार',
    en: 'Environment & Climate Change Advisors',
    descHi: 'पारिस्थितिकी पुनर्स्थापन, जलवायु अनुकूलन और हरित नीति विशेषज्ञ।',
    descEn: 'Ecological restoration, arid-zone climate adaptation & environmental policy specialists.',
  },
  {
    id: 'carbon-sustainability',
    hi: 'कार्बन क्रेडिट एवं सस्टेनेबिलिटी विशेषज्ञ',
    en: 'Carbon Credit & Sustainability Experts',
    descHi: 'MRV मानक, कृषि-वानिकी कार्बन लेखांकन और स्वतंत्र सत्यापन मार्गदर्शक।',
    descEn: 'MRV methodology, agroforestry carbon accounting & independent verification specialists.',
  },
  {
    id: 'agriculture-rural',
    hi: 'कृषि एवं ग्रामीण विकास सलाहकार',
    en: 'Agriculture & Rural Development Advisors',
    descHi: 'जैविक खेती, मृदा स्वास्थ्य, जल संरक्षण और किसान समृद्धि वैज्ञानिक।',
    descEn: 'Organic agronomy, soil biology, watershed management & farmer livelihood experts.',
  },
  {
    id: 'biogas-renewable',
    hi: 'नवीकरणीय ऊर्जा, बायोगैस एवं Bio-CNG विशेषज्ञ',
    en: 'Renewable Energy, Biogas & Bio-CNG Experts',
    descHi: 'गौशाला बायोगैस, CBG संयंत्र व्यवहार्यता और ग्रामीण सौर ऊर्जा अभियंता।',
    descEn: 'Gaushala biogas, compressed biogas (CBG) feasibility & rural solar engineers.',
  },
  {
    id: 'veterinary-gaushala',
    hi: 'पशु चिकित्सा एवं गौशाला विकास सलाहकार',
    en: 'Veterinary & Gaushala Development Advisors',
    descHi: 'देशी गोवंश संरक्षण, पशु पोषण, चिकित्सा देखभाल और स्वावलंबी गौशाला मॉडल।',
    descEn: 'Indigenous cattle genetics, veterinary welfare, fodder security & self-reliant Gaushalas.',
  },
  {
    id: 'education-skills',
    hi: 'शिक्षा एवं कौशल विकास सलाहकार',
    en: 'Education & Skill Development Advisors',
    descHi: 'ग्रामीण युवा रोजगार, विदेशी भाषा प्रशिक्षण, डिजिटल साक्षरता और विद्यालय सहयोग।',
    descEn: 'Rural youth skilling, foreign language faculty, digital literacy & school green campuses.',
  },
  {
    id: 'legal-finance-csr',
    hi: 'कानूनी, वित्त एवं CSR सलाहकार',
    en: 'Legal, Finance & CSR Advisors',
    descHi: 'Section 8 अनुपालन, चार्टर्ड अकाउंटेंसी, 12A/80G पारदर्शिता और कॉर्पोरेट CSR शासन।',
    descEn: 'Section 8 statutory compliance, chartered accountancy, 12A/80G governance & corporate CSR.',
  },
  {
    id: 'women-social',
    hi: 'महिला सशक्तिकरण एवं सामाजिक विकास सलाहकार',
    en: 'Women Empowerment & Social Development Advisors',
    descHi: 'महिला स्वयं सहायता समूह (SHG), ग्रामीण उद्यमिता, स्वास्थ्य जागरूकता और वृद्धजन कल्याण।',
    descEn: 'Women SHGs, rural micro-enterprise, community health & dignified senior citizen care.',
  },
  {
    id: 'research-academic',
    hi: 'अनुसंधान एवं अकादमिक सलाहकार',
    en: 'Research & Academic Advisors',
    descHi: 'विश्वविद्यालय शोध सहयोग, प्रभाव मूल्यांकन अध्ययन और ग्रामीण डेटा सत्यापन।',
    descEn: 'University research collaborations, baseline ecological studies & impact evaluation.',
  },
  {
    id: 'media-pr',
    hi: 'मीडिया, जनसंपर्क एवं संवाद सलाहकार',
    en: 'Media, Public Relations & Communication Advisors',
    descHi: 'जन-जागरूकता अभियान, त्रैमासिक पत्रिका संपादन और प्रामाणिक सामाजिक संवाद।',
    descEn: 'Public awareness campaigns, quarterly publication editorial review & ethical outreach.',
  },
] as const;

export function findStateByNameOrSlug(query: string): IndiaStateDirectory | undefined {
  const norm = query.trim().toLowerCase();
  return INDIA_STATES_DIRECTORY.find(
    (s) => s.slug === norm || s.nameEn.toLowerCase() === norm || s.nameHi === query.trim()
  );
}
