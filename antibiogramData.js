/**
 * Copyright 2012, Jonathan H. Chen (jonc101 at gmail.com / jonc101 at stanford.edu)
 *
 * Data Tables adapted from Sanford Guide to Antimicrobial Therapy 2010
 *
 * Stanford 2011 Antibiogram
 * http://lane.stanford.edu/biomed-resources/antibiogram/shcAntibiogram2011.pdf
 *
 * Palo Alto VA 2011 Antibiogram downloaded from
 * http://errolozdalga.com/medicine/pages/OtherPages/PAVAAntibiogram.html
 *
 * Lucille-Packard Childrens Hospital 2011 Antibiogram
 * http://lane.stanford.edu/biomed-resources/antibiogramLPCH/lpchAntibiogram2011.pdf
 */

// Default values for sensitivity percentages based on qualitative data from the above antimicrobial guide
var DEFAULT_SENSITIVITY_POSITIVE = 90;
var DEFAULT_SENSITIVITY_MODERATE = 50;
var DEFAULT_SENSITIVITY_NEGATIVE = 0;

// Special field, formats similar to a drug column, but instead represents number of isolates tested to produce antibiogram data
//  Useful to assess data reliability, as well as to assess relative organism prevalance
var NUMBER_TESTED_KEY = 'Number Tested';

var DRUG_LIST =
    [
        'Penicillin G',
        'Penicillin V',
        'Methicillin',
        'Nafcillin/Oxacillin',
        'Cloxacillin/Dicloxacilin',
        'Ampicillin/Amoxicillin',
        'Amoxicillin-Clavulanate',
        'Ampicillin-Sulbactam',
        'Ticarcillin',
        'Ticarcillin-Clavulanate',
        'Piperacillin-Tazobactam',
        'Piperacillin',
        'Doripenem',
        'Ertapenem',
        'Imipenem',
        'Meropenem',
        'Aztreonam',
        'Ciprofloxacin',
        'Ofloxacin',
        'Pefloxacin',
        'Levofloxacin',
        'Moxifloxacin',
        'Gemifloxacin',
        'Gatifloxacin',

        'Cefazolin',
        'Cefotetan',
        'Cefoxitin',
        'Cefuroxime',
        'Cefotaxime',
        'Ceftizoxime',
        'Ceftriaxone',
        'Ceftobiprole',
        'Ceftaroline',
        'Ceftazidime',
        'Cefepime',
        'Cefadroxil',
        'Cephalexin',
        'Cefaclor/Loracarbef',
        'Cefprozil',
        'Cefixime',
        'Ceftibuten',
        'Cefpodoxime/Cefdinir/Cefditoren',

        'Gentamicin',
        'Tobramycin',
        'Amikacin',
        'Chloramphenicol',
        'Clindamycin',
        'Erythromycin',
        'Azithromycin',
        'Clarithromycin',
        'Telithromycin',
        'Doxycycline',
        'Minocycline',
        'Tigecycline',
        'Vancomycin',
        'Teicoplanin',
        'Telavancin',
        'Fusidic Acid',
        'Trimethoprim',
        'TMP-SMX',
        'Nitrofurantoin',
        'Fosfomycin',
        'Rifampin',
        'Metronidazole',
        'Quinupristin-Dalfopristin',
        'Linezolid',
        'Daptomycin',
        'Colistimethate',

        // Additional elements from Stanford Antibiogram
        'Amphotericin B',
        'Caspofungin',
        'Fluconazole',
        'Itraconazole',
        'Voriconazole',
    ];
DRUG_LIST.sort();   // Present in alphabetic sorted order


var DRUG_CLASS_LIST =
    [
        'Oral Available',

        'Penicillin',
        'Anti-Staphylococcal Penicillin',
        'Amino-Penicillin',
        'Anti-Pseudomonal Penicillin',
        'Carbapenem',
        'Monobactam',

        'Cephalosporin (IV) Gen 1',
        'Cephalosporin (IV) Gen 2',
        'Cephalosporin (IV) Gen 3+',
        'Cephalosporin (PO) Gen 1',
        'Cephalosporin (PO) Gen 2',
        'Cephalosporin (PO) Gen 3',

        'Fluoroquinolone',
        'Aminoglycoside',
        'Protein Synthesis Inhibitor',
        'Macrolide',
        'Ketolide',
        'Tetracycline',
        'Glycylcycline',
        'Glycopeptide',
        'Anti-Metabolite',
        'Urinary Tract',
        'Miscellaneous',

        'Anti-Fungal'
    ];

var PROPERTIES_BY_DRUG =
    {
        'Penicillin G': ['Penicillin','Oral Available'],
        'Penicillin V': ['Penicillin','Oral Available'],
        'Methicillin': ['Anti-Staphylococcal Penicillin'],
        'Nafcillin/Oxacillin': ['Anti-Staphylococcal Penicillin'],
        'Cloxacillin/Dicloxacilin': ['Anti-Staphylococcal Penicillin','Oral Available'],
        'Ampicillin/Amoxicillin': ['Amino-Penicillin','Oral Available'],
        'Amoxicillin-Clavulanate': ['Amino-Penicillin','Oral Available'],
        'Ampicillin-Sulbactam': ['Amino-Penicillin'],
        'Ticarcillin': ['Anti-Pseudomonal Penicillin'],
        'Ticarcillin-Clavulanate': ['Anti-Pseudomonal Penicillin'],
        'Piperacillin-Tazobactam': ['Anti-Pseudomonal Penicillin'],
        'Piperacillin': ['Anti-Pseudomonal Penicillin'],
        'Doripenem': ['Carbapenem'],
        'Ertapenem': ['Carbapenem'],
        'Imipenem': ['Carbapenem'],
        'Meropenem': ['Carbapenem'],
        'Aztreonam': ['Monobactam'],
        'Ciprofloxacin': ['Fluoroquinolone','Oral Available'],
        'Ofloxacin': ['Fluoroquinolone'],
        'Pefloxacin': ['Fluoroquinolone'],
        'Levofloxacin': ['Fluoroquinolone','Oral Available'],
        'Moxifloxacin': ['Fluoroquinolone','Oral Available'],
        'Gemifloxacin': ['Fluoroquinolone'],
        'Gatifloxacin': ['Fluoroquinolone'],

        'Cefazolin': ['Cephalosporin (IV) Gen 1'],
        'Cefotetan': ['Cephalosporin (IV) Gen 2'],
        'Cefoxitin': ['Cephalosporin (IV) Gen 2'],
        'Cefuroxime': ['Cephalosporin (IV) Gen 2'],
        'Cefotaxime': ['Cephalosporin (IV) Gen 3+'],
        'Ceftizoxime': ['Cephalosporin (IV) Gen 3+'],
        'Ceftriaxone': ['Cephalosporin (IV) Gen 3+'],
        'Ceftobiprole': ['Cephalosporin (IV) Gen 3+'],
        'Ceftaroline': ['Cephalosporin (IV) Gen 3+'],
        'Ceftazidime': ['Cephalosporin (IV) Gen 3+'],
        'Cefepime': ['Cephalosporin (IV) Gen 3+'],
        'Cefadroxil': ['Cephalosporin (PO) Gen 1','Oral Available'],
        'Cephalexin': ['Cephalosporin (PO) Gen 1','Oral Available'],
        'Cefaclor/Loracarbef': ['Cephalosporin (PO) Gen 2','Oral Available'],
        'Cefprozil': ['Cephalosporin (PO) Gen 2','Oral Available'],
        'Cefuroxime': ['Cephalosporin (PO) Gen 2','Oral Available'],
        'Cefixime': ['Cephalosporin (PO) Gen 3','Oral Available'],
        'Ceftibuten': ['Cephalosporin (PO) Gen 3','Oral Available'],
        'Cefpodoxime/Cefdinir/Cefditoren': ['Cephalosporin (PO) Gen 3','Oral Available'],

        'Gentamicin': ['Aminoglycoside'],
        'Tobramycin': ['Aminoglycoside'],
        'Amikacin': ['Aminoglycoside'],
        'Chloramphenicol': ['Protein Synthesis Inhibitor','Oral Available'],
        'Clindamycin': ['Protein Synthesis Inhibitor','Oral Available'],
        'Erythromycin': ['Macrolide','Oral Available'],
        'Azithromycin': ['Macrolide','Oral Available'],
        'Clarithromycin': ['Macrolide','Oral Available'],
        'Telithromycin': ['Ketolide'],
        'Doxycycline': ['Tetracycline','Oral Available'],
        'Minocycline': ['Tetracycline'],
        'Tigecycline': ['Glycylcycline'],
        'Vancomycin': ['Glycopeptide'],
        'Teicoplanin': ['Glycopeptide'],
        'Telavancin': ['Glycopeptide'],
        'Fusidic Acid': ['Anti-Metabolite'],
        'Trimethoprim': ['Anti-Metabolite','Oral Available'],
        'TMP-SMX': ['Anti-Metabolite','Oral Available'],
        'Nitrofurantoin': ['Urinary Tract','Oral Available'],
        'Fosfomycin': ['Urinary Tract'],
        'Rifampin': ['Miscellaneous','Oral Available'],
        'Metronidazole': ['Miscellaneous','Oral Available'],
        'Quinupristin-Dalfopristin': ['Miscellaneous'],
        'Linezolid': ['Miscellaneous','Oral Available'],
        'Daptomycin': ['Miscellaneous'],
        'Colistimethate': ['Miscellaneous'],

        'Amphotericin B': ['Anti-Fungal'],
        'Caspofungin': ['Anti-Fungal'],
        'Fluconazole': ['Anti-Fungal','Oral Available'],
        'Itraconazole': ['Anti-Fungal','Oral Available'],
        'Voriconazole': ['Anti-Fungal','Oral Available'],

        'Number Tested': ['Meta-Data']
    };

var BUG_LIST =
    [
        'Streptococcus Group A,B,C,G',
        'Streptococcus pneumoniae',
        'Streptococcus viridans Group',
        'Streptococcus milleri',
        'Enterococcus faecalis',
        'Enterococcus faecium',
        'Staphylococcus aureus (MSSA)',
        'Staphylococcus aureus (MRSA)',
        'Staphylococcus aureus (CA-MRSA)',
        'Staphylococcus, Coagulase Negative (epidermidis)',
        'Corynebacterium jeikeium',
        'Listeria monocytogenes',
        'Neisseria gonorrhoeae',
        'Neisseria meningitidis',
        'Moraxella catarrhalis',
        'Haemophilus influenzae',
        'Escheria coli',
        'Klebsiella',
        'Escheria coli/Klebsiella ESBL',
        'Escheria coli/Klebsiella KPC',
        'Enterobacter',
        'Serratia marcescens',
        'Serratia',
        'Salmonella',
        'Shigella',
        'Proteus mirabilis',
        'Proteus vulgaris',
        'Providencia',
        'Morganella',
        'Citrobacter freundii',
        'Citrobacter diversus',
        'Citrobacter',
        'Aeromonas',
        'Acinetobacter',
        'Pseudomonas aeruginosa',
        'Burkholderia cepacia',
        'Stenotrophomonas maltophilia',
        'Yersinia enterocolitica',
        'Franciscella tularensis',
        'Brucella',
        'Vibrio vulnificus',
        'Legionella',
        'Pasteurella multocida',
        'Haemophilus ducreyi',
        'Chlamydophila',
        'Mycoplasma pneumoniae',
        'Mycobacterium avium',
        'Rickettsia',
        'Actinomyces',
        'Bacteroides fragilis',
        'Prevotella melaninogenica',
        'Clostridium difficile',
        'Clostridium (not difficile)',
        'Peptostreptococcus',

        // Additional elements from Stanford Antibiogram
        'Streptococcus Group B (agalactiae)',
        'Enterococcus (unspeciated)',

        'Achromobacter xylosoxidans',
        'Citrobacter koseri',
        'Enterobacter aerogenes',
        'Enterobacter cloacae',
        'Klebsiella oxytoca',
        'Klebsiella pneumoniae',
        'Pseudomonas aeruginosa CF mucoid',
        'Pseudomonas aeruginosa CF non-mucoid',

        'Staphylococcus aureus (all)',
        'Staphylococcus lugdunensis',

        'Bacteroides (not fragilis)',
        'Gram Negative Rods (other)',
        'Gram Positive Rods (all)',
        'Campylobacter',

        'Candida albicans',
        'Candida glabrata',
        'Candida parapsilosis',
        'Candida krusei',
        'Candida (other)',

        'Cryptococcus neoformans',

        'Aspergillus fumigatus',
        'Aspergillus flavus',
        'Aspergillus terreus',
        'Fusarium',
        'Scedosporium apiospermum (Pseudoallescheria boydii)',
        'Scedosporium prolificans',
        'Trichosporon',
        'Zygomycetes (Absidia, Mucor, Rhizopus)',
        'Dematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)',

        'Blastomyces dermatitidis',
        'Coccidioides immitis/posadasii',
        'Histoplasma capsulatum',
        'Sporothrix schenckii',

        // Additional elements from VA Antibiogram
        'Staphylococcus capitis',
        'Staphylococcus hominis'
    ];
BUG_LIST.sort();    // Present in sorted order to facilitate selection lookup


var BUG_PROPERTY_LIST =
    [   'Gram Positive',

        'Gram Positive Cocci in Pairs / Chains',
        'Gram Positive Cocci in Clusters',
        'Gram Positive Cocci in Clusters, Coagulase Negative',
        'Gram Positive Rods',

        'Gram Negative',
        'Gram Negative (Diplo)Cocci',
        'Gram Negative Rods, Lactose Fermenting',
        'Gram Negative Rods, Non-Lactose Fermenting',
        'Gram Negative Rods, Non-Fermenting',

        'Atypical',
        'Anaerobe',
        'Fungal (Yeast)',
        'Fungal (Mold)',
        'Fungal (Dimorphic)'
    ];

var PROPERTIES_BY_BUG =
    {
        'Streptococcus Group A,B,C,G': ['Gram Positive', 'Gram Positive Cocci in Pairs / Chains'],
        'Streptococcus pneumoniae': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Streptococcus viridans Group': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Streptococcus milleri': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Enterococcus faecalis': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Enterococcus faecium': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Staphylococcus aureus (MSSA)': ['Gram Positive','Gram Positive Cocci in Clusters'],
        'Staphylococcus aureus (MRSA)': ['Gram Positive','Gram Positive Cocci in Clusters'],
        'Staphylococcus aureus (CA-MRSA)': ['Gram Positive','Gram Positive Cocci in Clusters'],
        'Staphylococcus, Coagulase Negative (epidermidis)': ['Gram Positive','Gram Positive Cocci in Clusters','Gram Positive Cocci in Clusters, Coagulase Negative'],
        'Corynebacterium jeikeium': ['Gram Positive','Gram Positive Rods'],
        'Listeria monocytogenes': ['Gram Positive','Gram Positive Rods'],
        'Neisseria gonorrhoeae': ['Gram Negative','Gram Negative (Diplo)Cocci'],
        'Neisseria meningitidis': ['Gram Negative','Gram Negative (Diplo)Cocci'],
        'Moraxella catarrhalis': ['Gram Negative','Gram Negative (Diplo)Cocci'],
        'Haemophilus influenzae': ['Gram Negative'],
        'Escheria coli': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Klebsiella': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Escheria coli/Klebsiella ESBL': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Escheria coli/Klebsiella KPC': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Enterobacter': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Serratia marcescens': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Serratia': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Salmonella': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Shigella': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Proteus mirabilis': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Proteus vulgaris': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Providencia': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Morganella': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting'],
        'Citrobacter freundii': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Citrobacter diversus': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Citrobacter': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Aeromonas': ['Gram Negative'],
        'Acinetobacter': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting','Gram Negative Rods, Non-Fermenting'],
        'Pseudomonas aeruginosa': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting','Gram Negative Rods, Non-Fermenting'],
        'Burkholderia cepacia': ['Gram Negative'],
        'Stenotrophomonas maltophilia': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting','Gram Negative Rods, Non-Fermenting'],
        'Yersinia enterocolitica': ['Gram Negative'],
        'Franciscella tularensis': ['Gram Negative'],
        'Brucella': ['Gram Negative'],
        'Vibrio vulnificus': ['Gram Negative'],
        'Legionella': ['Gram Negative'],
        'Pasteurella multocida': ['Gram Negative'],
        'Haemophilus ducreyi': ['Gram Negative'],
        'Chlamydophila': ['Atypical'],
        'Mycoplasma pneumoniae': ['Atypical'],
        'Mycobacterium avium': ['Atypical'],
        'Rickettsia': ['Atypical'],
        'Actinomyces': ['Anaerobe'],
        'Bacteroides fragilis': ['Anaerobe'],
        'Prevotella melaninogenica': ['Anaerobe'],
        'Clostridium difficile': ['Anaerobe','Gram Positive Rods'],
        'Clostridium (not difficile)': ['Anaerobe','Gram Positive Rods'],
        'Peptostreptococcus': ['Anaerobe'],


        'Streptococcus Group B (agalactiae)': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Enterococcus (unspeciated)': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],

        'Achromobacter xylosoxidans': ['Gram Negative'],
        'Citrobacter koseri': ['Gram Negative','Gram Negative Rods Lactose Fermenting'],
        'Enterobacter aerogenes': ['Gram Negative','Gram Negative Rods Lactose Fermenting'],
        'Enterobacter cloacae': ['Gram Negative','Gram Negative Rods Lactose Fermenting'],
        'Klebsiella oxytoca': ['Gram Negative','Gram Negative Rods Lactose Fermenting'],
        'Klebsiella pneumoniae': ['Gram Negative','Gram Negative Rods Lactose Fermenting'],
        'Pseudomonas aeruginosa CF mucoid': ['Gram Negative','Gram Negative Rods Non-Lactose Fermenting','Gram Negative Rods Non-Fermenting'],
        'Pseudomonas aeruginosa CF non-mucoid': ['Gram Negative','Gram Negative Rods Non-Lactose Fermenting','Gram Negative Rods Non-Fermenting'],

        'Staphylococcus aureus (all)': ['Gram Positive','Gram Positive Cocci in Clusters'],
        'Staphylococcus lugdunensis': ['Gram Positive','Gram Positive Cocci in Clusters','Gram Positive Cocci in Clusters, Coagulase Negative'],

        'Bacteroides (not fragilis)': ['Anaerobe'],
        'Gram Negative Rods (other)': ['Gram Negative'],
        'Gram Positive Rods (all)': ['Gram Positive','Gram Positive Rods'],
        'Campylobacter': ['Gram Negative'],

        'Candida albicans': ['Fungal (Yeast)'],
        'Candida glabrata': ['Fungal (Yeast)'],
        'Candida parapsilosis': ['Fungal (Yeast)'],
        'Candida krusei': ['Fungal (Yeast)'],
        'Candida (other)': ['Fungal (Yeast)'],

        'Cryptococcus neoformans': ['Fungal (Yeast)'],

        'Aspergillus fumigatus': ['Fungal (Mold)'],
        'Aspergillus flavus': ['Fungal (Mold)'],
        'Aspergillus terreus': ['Fungal (Mold)'],
        'Fusarium': ['Fungal (Mold)'],
        'Scedosporium apiospermum (Pseudoallescheria boydii)': ['Fungal (Mold)'],
        'Scedosporium prolificans': ['Fungal (Mold)'],
        'Trichosporon': ['Fungal (Mold)'],
        'Zygomycetes (Absidia, Mucor, Rhizopus)': ['Fungal (Mold)'],
        'Dematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)': ['Fungal (Mold)'],

        'Blastomyces dermatitidis': ['Fungal (Dimorphic)'],
        'Coccidioides immitis/posadasii': ['Fungal (Dimorphic)'],
        'Histoplasma capsulatum': ['Fungal (Dimorphic)'],
        'Sporothrix schenckii': ['Fungal (Dimorphic)'],

        'Staphylococcus capitis': ['Gram Positive','Gram Positive Cocci in Clusters','Gram Positive Cocci in Clusters, Coagulase Negative'],
        'Staphylococcus hominis': ['Gram Positive','Gram Positive Cocci in Clusters','Gram Positive Cocci in Clusters, Coagulase Negative']

    };

// Keyed by microorganism name, returns dictionary of anti-microbial names
//  with respective clinical sensitivity value
//  (preferably in % form by local antibiogram).
// Generic numbers used from Sanford guide for general categories
//  (90% for + sensitivity, 50% for +/-, 0% for 0, blank (effectively null) for unknowns)
var SENSITIVITY_TABLE_BY_BUG =
    {
        'Streptococcus Group A,B,C,G': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 50,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 90,'Ciprofloxacin': 50,'Clarithromycin': 50,'Clindamycin': 90,'Cloxacillin/Dicloxacilin': 90,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 50,'Fusidic Acid': 50,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Methicillin': 90,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Nitrofurantoin': 90,'Ofloxacin': 50,'Pefloxacin': 0,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 90,'Vancomycin': 90},
        'Streptococcus pneumoniae': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 50,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 90,'Ciprofloxacin': 50,'Clarithromycin': 90,'Clindamycin': 90,'Cloxacillin/Dicloxacilin': 90,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 90,'Fusidic Acid': 50,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Methicillin': 90,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Nitrofurantoin': 90,'Ofloxacin': 50,'Pefloxacin': 0,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 50,'Vancomycin': 90},
        'Streptococcus viridans Group': {'Amikacin': 90,'Amoxicillin-Clavulanate': 50,'Ampicillin-Sulbactam': 50,'Ampicillin/Amoxicillin': 50,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 50,'Ceftibuten': 0,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 50,'Ciprofloxacin': 0,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 50,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 90,'Doxycycline': 0,'Ertapenem': 90,'Erythromycin': 0,'Fosfomycin': 90,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Methicillin': 50,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 50,'Nitrofurantoin': 90,'Ofloxacin': 0,'Penicillin G': 50,'Penicillin V': 50,'Piperacillin': 50,'Piperacillin-Tazobactam': 50,'Quinupristin-Dalfopristin': 0,'Rifampin': 50,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 50,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 50,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 90,'Vancomycin': 90},
        'Streptococcus milleri': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Aztreonam': 0,'Ciprofloxacin': 0,'Cloxacillin/Dicloxacilin': 90,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Ofloxacin': 0,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Enterococcus faecalis': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 90,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 50,'Ciprofloxacin': 50,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 50,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fosfomycin': 50,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 50,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 50,'Pefloxacin': 0,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 0,'TMP-SMX': 0,'Teicoplanin': 50,'Telavancin': 90,'Telithromycin': 0,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 50,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 0,'Vancomycin': 50},
        'Enterococcus faecium': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 90,'Aztreonam': 0,'Chloramphenicol': 50,'Ciprofloxacin': 0,'Clarithromycin': 90,'Clindamycin': 90,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 0,'Doxycycline': 50,'Ertapenem': 0,'Erythromycin': 50,'Fusidic Acid': 90,'Gatifloxacin': 50,'Gemifloxacin': 50,'Gentamicin': 90,'Imipenem': 50,'Levofloxacin': 0,'Linezolid': 90,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 50,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 0,'Pefloxacin': 0,'Penicillin G': 50,'Penicillin V': 50,'Piperacillin': 50,'Piperacillin-Tazobactam': 50,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 90,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 50,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50,'Vancomycin': 90},
        'Staphylococcus aureus (MSSA)': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 0,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 50,'Ceftibuten': 0,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 0,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 90,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Methicillin': 90,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Nitrofurantoin': 90,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 50,'Vancomycin': 90},
        'Staphylococcus aureus (MRSA)': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 50,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 90,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Ciprofloxacin': 0,'Clarithromycin': 50,'Clindamycin': 50,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 0,'Doxycycline': 90,'Ertapenem': 0,'Erythromycin': 50,'Fusidic Acid': 90,'Gatifloxacin': 50,'Gemifloxacin': 50,'Imipenem': 0,'Levofloxacin': 0,'Linezolid': 90,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 50,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 0,'Pefloxacin': 0,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 50,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tigecycline': 90,'Trimethoprim': 90,'Vancomycin': 90},
        'Staphylococcus aureus (CA-MRSA)': {'Amikacin': 50,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 90,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 0,'Ciprofloxacin': 50,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 0,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 50,'Fusidic Acid': 90,'Gatifloxacin': 50,'Gemifloxacin': 50,'Gentamicin': 50,'Imipenem': 0,'Levofloxacin': 50,'Linezolid': 90,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 50,'Nafcillin/Oxacillin': 0,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 50,'Teicoplanin': 50,'Telavancin': 90,'Telithromycin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tigecycline': 90,'Tobramycin': 50,'Trimethoprim': 90,'Vancomycin': 90},
        'Staphylococcus, Coagulase Negative (epidermidis)': {'Amikacin': 0,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 50,'Cefadroxil': 50,'Cefazolin': 50,'Cefepime': 50,'Cefixime': 0,'Cefotaxime': 50,'Cefotetan': 50,'Cefoxitin': 50,'Cefpodoxime/Cefdinir/Cefditoren': 50,'Cefprozil': 50,'Ceftaroline': 90,'Ceftazidime': 50,'Ceftibuten': 0,'Ceftizoxime': 50,'Ceftobiprole': 90,'Ceftriaxone': 50,'Cefuroxime': 50,'Cephalexin': 50,'Chloramphenicol': 0,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 90,'Colistimethate': 0,'Daptomycin': 90,'Doripenem': 90,'Doxycycline': 0,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Methicillin': 90,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Nitrofurantoin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 0,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 0,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 50,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 0,'Vancomycin': 90},
        'Corynebacterium jeikeium': {'Amikacin': 90,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefprozil': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 90,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 50,'Doxycycline': 90,'Ertapenem': 0,'Erythromycin': 90,'Gentamicin': 90,'Imipenem': 0,'Linezolid': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 0,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 90,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 90,'Vancomycin': 90},
        'Listeria monocytogenes': {'Amikacin': 0,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 50,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 50,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 50,'Erythromycin': 50,'Fosfomycin': 90,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 0,'Pefloxacin': 0,'Penicillin G': 90,'Penicillin V': 0,'Piperacillin': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 90,'Ticarcillin': 90,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 0,'Vancomycin': 0},
        'Neisseria gonorrhoeae': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 90,'Cefaclor/Loracarbef': 50,'Cefadroxil': 0,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 50,'Cefotetan': 50,'Cefoxitin': 50,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 50,'Ceftaroline': 90,'Ceftazidime': 50,'Ceftibuten': 50,'Ceftizoxime': 50,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 90,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tobramycin': 0,'Trimethoprim': 50,'Vancomycin': 0},
        'Neisseria meningitidis': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 90,'Aztreonam': 90,'Cefaclor/Loracarbef': 50,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 50,'Cefotaxime': 90,'Cefotetan': 50,'Cefoxitin': 50,'Cefprozil': 50,'Ceftaroline': 90,'Ceftazidime': 50,'Ceftibuten': 50,'Ceftizoxime': 50,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 90,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 90,'Gatifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 50,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 90,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'TMP-SMX': 90,'Telithromycin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90},
        'Moraxella catarrhalis': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 90,'Cefaclor/Loracarbef': 50,'Cefadroxil': 0,'Cefazolin': 50,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 90,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 50,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 50,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 50,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 50,'Rifampin': 90,'TMP-SMX': 50,'Telithromycin': 90,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50},
        'Haemophilus influenzae': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 50,'Aztreonam': 90,'Cefaclor/Loracarbef': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 50,'Piperacillin-Tazobactam': 90,'Rifampin': 0,'TMP-SMX': 90,'Teicoplanin': 0,'Telavancin': 0,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Vancomycin': 0},
        'Escheria coli': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 50,'Azithromycin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 50,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Fosfomycin': 50,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 50,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50,'Vancomycin': 0},
        'Klebsiella': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Chloramphenicol': 50,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50,'Vancomycin': 0},
        'Escheria coli/Klebsiella ESBL': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 90,'Ertapenem': 90,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 50,'Quinupristin-Dalfopristin': 0,'Teicoplanin': 0,'Telavancin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 50,'Vancomycin': 0},
        'Escheria coli/Klebsiella KPC': {'Amikacin': 90,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 0,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 0,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fosfomycin': 50,'Fusidic Acid': 0,'Gentamicin': 90,'Imipenem': 50,'Linezolid': 0,'Meropenem': 50,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 50,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50,'Vancomycin': 0},
        'Enterobacter': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 50,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 0,'Cefotaxime': 90,'Cefotetan': 50,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 50,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Trimethoprim': 50,'Vancomycin': 0},
        'Serratia': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 50,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 50,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 0,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Salmonella': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 50,'Azithromycin': 50,'Cefadroxil': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 50,'Vancomycin': 0},
        'Shigella': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 50,'Azithromycin': 0,'Aztreonam': 90,'Cefadroxil': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftriaxone': 90,'Cephalexin': 0,'Chloramphenicol': 0,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 0,'Ertapenem': 90,'Erythromycin': 0,'Fosfomycin': 50,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 0,'Vancomycin': 0},
        'Proteus mirabilis': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Aztreonam': 90,'Cefaclor/Loracarbef': 90,'Cefadroxil': 90,'Cefazolin': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 90,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Proteus vulgaris': {'Amikacin': 50,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 50,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 0,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 0,'Ertapenem': 90,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 50,'Tobramycin': 0,'Trimethoprim': 0,'Vancomycin': 0},
        'Providencia': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Morganella': {'Amoxicillin-Clavulanate': 50,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 0,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 0,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Citrobacter': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 50,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 50,'Cefoxitin': 50,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Aeromonas': {'Amikacin': 90,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 90,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 50,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 0,'Fosfomycin': 90,'Fusidic Acid': 0,'Gemifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 90,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 50,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 90,'Trimethoprim': 90,'Vancomycin': 0},
        'Acinetobacter': {'Amikacin': 90,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 50,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefprozil': 0,'Ceftazidime': 50,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 50,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 0,'Ciprofloxacin': 50,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 90,'Daptomycin': 0,'Doripenem': 50,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 50,'Gemifloxacin': 50,'Gentamicin': 90,'Imipenem': 50,'Levofloxacin': 50,'Linezolid': 0,'Meropenem': 50,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 50,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 0,'Ofloxacin': 50,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 50,'Quinupristin-Dalfopristin': 0,'Rifampin': 0,'TMP-SMX': 0,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 50,'Tigecycline': 0,'Tobramycin': 90,'Trimethoprim': 0,'Vancomycin': 0},
        'Pseudomonas aeruginosa': {'Amikacin': 0,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 90,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 0,'Cefotaxime': 50,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 50,'Ceftazidime': 90,'Ceftibuten': 0,'Ceftizoxime': 50,'Ceftobiprole': 90,'Ceftriaxone': 50,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 50,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 50,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 50,'Moxifloxacin': 50,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 0,'Ofloxacin': 50,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Rifampin': 0,'TMP-SMX': 90,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 50,'Tobramycin': 0,'Trimethoprim': 90,'Vancomycin': 0},
        'Burkholderia cepacia': {'Amikacin': 0,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 50,'Cefixime': 0,'Cefotaxime': 50,'Cefotetan': 0,'Cefoxitin': 0,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 50,'Ceftobiprole': 0,'Ceftriaxone': 50,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Colistimethate': 50,'Daptomycin': 0,'Doripenem': 50,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fusidic Acid': 0,'Gatifloxacin': 0,'Gentamicin': 0,'Imipenem': 0,'Linezolid': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 0,'Nafcillin/Oxacillin': 0,'Nitrofurantoin': 0,'Ofloxacin': 0,'Penicillin G': 0,'Penicillin V': 0,'TMP-SMX': 90,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Ticarcillin': 0,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 0,'Vancomycin': 0},
        'Stenotrophomonas maltophilia': {'Amikacin': 90,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 0,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 50,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 0,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 0,'Doxycycline': 0,'Ertapenem': 0,'Erythromycin': 0,'Fusidic Acid': 0,'Gentamicin': 90,'Imipenem': 0,'Levofloxacin': 50,'Linezolid': 0,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 0,'Pefloxacin': 0,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 50,'Piperacillin-Tazobactam': 50,'TMP-SMX': 90,'Telithromycin': 0,'Ticarcillin-Clavulanate': 50,'Tobramycin': 90},
        'Yersinia enterocolitica': {'Amoxicillin-Clavulanate': 50,'Ampicillin-Sulbactam': 50,'Ampicillin/Amoxicillin': 0,'Aztreonam': 90,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 50,'Cefoxitin': 50,'Ceftazidime': 50,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 90,'Doxycycline': 90,'Gatifloxacin': 90,'Gentamicin': 90,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 0,'Methicillin': 0,'Metronidazole': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 90,'Rifampin': 90,'TMP-SMX': 90,'Ticarcillin': 50,'Ticarcillin-Clavulanate': 90},
        'Legionella': {'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftobiprole': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clindamycin': 90,'Cloxacillin/Dicloxacilin': 0,'Daptomycin': 0,'Doripenem': 0,'Ertapenem': 0,'Erythromycin': 90,'Gatifloxacin': 90,'Gemifloxacin': 90,'Imipenem': 0,'Levofloxacin': 90,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'TMP-SMX': 50,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Vancomycin': 0},
        'Pasteurella multocida': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Aztreonam': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefpodoxime/Cefdinir/Cefditoren': 90,'Ceftizoxime': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 0,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Methicillin': 0,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Haemophilus ducreyi': {'Amikacin': 50,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Cefixime': 90,'Cefotaxime': 90,'Cefoxitin': 90,'Ceftazidime': 90,'Ceftizoxime': 90,'Ceftriaxone': 90,'Chloramphenicol': 90,'Daptomycin': 0,'Doxycycline': 90,'Fusidic Acid': 0,'Gentamicin': 50,'Metronidazole': 0,'Minocycline': 90,'Penicillin G': 90,'Tobramycin': 50},
        'Chlamydophila': {'Amikacin': 0,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Clarithromycin': 90,'Clindamycin': 0,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 0,'Doxycycline': 90,'Ertapenem': 0,'Erythromycin': 90,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 0,'Levofloxacin': 90,'Linezolid': 0,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'Quinupristin-Dalfopristin': 90,'Telithromycin': 90,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tigecycline': 90,'Tobramycin': 0},
        'Mycoplasma pneumoniae': {'Amikacin': 0,'Amoxicillin-Clavulanate': 0,'Ampicillin-Sulbactam': 0,'Ampicillin/Amoxicillin': 0,'Aztreonam': 0,'Chloramphenicol': 90,'Ciprofloxacin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 0,'Doxycycline': 90,'Ertapenem': 0,'Erythromycin': 50,'Fusidic Acid': 0,'Gatifloxacin': 90,'Gemifloxacin': 90,'Gentamicin': 0,'Imipenem': 0,'Levofloxacin': 90,'Meropenem': 0,'Methicillin': 0,'Metronidazole': 0,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 90,'Pefloxacin': 90,'Penicillin G': 0,'Penicillin V': 0,'Piperacillin': 0,'Piperacillin-Tazobactam': 0,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 90,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 0,'Tobramycin': 0,'Vancomycin': 0},
        'Actinomyces': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 0,'Aztreonam': 0,'Ceftizoxime': 90,'Ceftriaxone': 90,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 0,'Clindamycin': 50,'Cloxacillin/Dicloxacilin': 0,'Doxycycline': 50,'Ertapenem': 90,'Erythromycin': 0,'Gatifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Linezolid': 50,'Methicillin': 0,'Metronidazole': 90,'Minocycline': 50,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 50,'Penicillin G': 90,'Penicillin V': 50,'Piperacillin': 90,'TMP-SMX': 0,'Telavancin': 0,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 90,'Vancomycin': 0},
        'Bacteroides fragilis': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 0,'Azithromycin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 0,'Cefazolin': 0,'Cefepime': 0,'Cefixime': 0,'Cefotaxime': 0,'Cefotetan': 50,'Cefoxitin': 90,'Cefprozil': 0,'Ceftaroline': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 50,'Ceftobiprole': 0,'Ceftriaxone': 0,'Cefuroxime': 0,'Cephalexin': 0,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 90,'Clindamycin': 90,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Fusidic Acid': 90,'Gatifloxacin': 50,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 0,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 90,'Minocycline': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 0,'Pefloxacin': 0,'Penicillin G': 0,'Penicillin V': 50,'Piperacillin': 0,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 90,'Telavancin': 0,'Ticarcillin': 0,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 0,'Vancomycin': 0},
        'Prevotella melaninogenica': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefepime': 0,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefprozil': 90,'Ceftazidime': 90,'Ceftizoxime': 90,'Ceftobiprole': 50,'Ceftriaxone': 50,'Cefuroxime': 90,'Chloramphenicol': 50,'Ciprofloxacin': 0,'Cloxacillin/Dicloxacilin': 0,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 50,'Meropenem': 90,'Methicillin': 0,'Metronidazole': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 0,'Ofloxacin': 50,'Penicillin G': 90,'Penicillin V': 0,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Quinupristin-Dalfopristin': 50,'Teicoplanin': 90,'Telavancin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tobramycin': 0,'Vancomycin': 90},
        'Clostridium difficile': {'Ampicillin-Sulbactam': 90,'Azithromycin': 90,'Aztreonam': 0,'Cefepime': 0,'Cefotaxime': 0,'Cefoxitin': 0,'Ceftizoxime': 0,'Ceftobiprole': 0,'Chloramphenicol': 90,'Ciprofloxacin': 0,'Clarithromycin': 90,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 50,'Fusidic Acid': 90,'Gatifloxacin': 0,'Imipenem': 90,'Levofloxacin': 0,'Linezolid': 90,'Meropenem': 90,'Metronidazole': 90,'Minocycline': 90,'Moxifloxacin': 0,'Penicillin G': 90,'Piperacillin': 90,'Quinupristin-Dalfopristin': 90,'Teicoplanin': 90,'Telavancin': 90,'Tigecycline': 90,'Vancomycin': 90},
        'Clostridium (not difficile)': {'Amikacin': 0,'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Azithromycin': 90,'Aztreonam': 0,'Cefixime': 0,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefprozil': 90,'Ceftazidime': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Chloramphenicol': 90,'Ciprofloxacin': 50,'Clarithromycin': 50,'Clindamycin': 90,'Doripenem': 90,'Doxycycline': 90,'Ertapenem': 90,'Erythromycin': 50,'Fusidic Acid': 90,'Gatifloxacin': 90,'Gentamicin': 0,'Imipenem': 90,'Levofloxacin': 90,'Linezolid': 90,'Meropenem': 90,'Metronidazole': 90,'Minocycline': 90,'Moxifloxacin': 90,'Ofloxacin': 50,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Teicoplanin': 90,'Telavancin': 90,'Telithromycin': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90,'Tigecycline': 90,'Tobramycin': 0,'Vancomycin': 90},
        'Peptostreptococcus': {'Amoxicillin-Clavulanate': 90,'Ampicillin-Sulbactam': 90,'Ampicillin/Amoxicillin': 90,'Aztreonam': 0,'Cefaclor/Loracarbef': 90,'Cefepime': 90,'Cefixime': 90,'Cefotaxime': 90,'Cefotetan': 90,'Cefoxitin': 90,'Cefprozil': 90,'Ceftazidime': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 90,'Cephalexin': 90,'Ciprofloxacin': 50,'Cloxacillin/Dicloxacilin': 90,'Doripenem': 90,'Ertapenem': 90,'Gatifloxacin': 90,'Imipenem': 90,'Levofloxacin': 90,'Meropenem': 90,'Methicillin': 90,'Moxifloxacin': 90,'Nafcillin/Oxacillin': 90,'Ofloxacin': 50,'Penicillin G': 90,'Penicillin V': 90,'Piperacillin': 90,'Piperacillin-Tazobactam': 90,'Ticarcillin': 90,'Ticarcillin-Clavulanate': 90},
        'Citrobacter freundii': {'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefixime': 0,'Cefotaxime': 90,'Cefotetan': 0,'Cefoxitin': 0,'Cefpodoxime/Cefdinir/Cefditoren': 0,'Cefprozil': 0,'Ceftazidime': 0,'Ceftibuten': 0,'Ceftizoxime': 0,'Ceftriaxone': 90,'Cefuroxime': 0,'Cephalexin': 0},
        'Citrobacter diversus': {'Cefaclor/Loracarbef': 0,'Cefadroxil': 0,'Cefazolin': 0,'Cefepime': 90,'Cefotaxime': 90,'Cefotetan': 50,'Cefoxitin': 50,'Cefprozil': 0,'Ceftaroline': 90,'Ceftazidime': 90,'Ceftibuten': 90,'Ceftizoxime': 90,'Ceftobiprole': 90,'Ceftriaxone': 90,'Cefuroxime': 50,'Cephalexin': 0},
        'Serratia marcescens': {'Amikacin': 90,'Azithromycin': 0,'Chloramphenicol': 50,'Clarithromycin': 0,'Clindamycin': 0,'Colistimethate': 0,'Daptomycin': 0,'Doxycycline': 0,'Erythromycin': 0,'Fosfomycin': 50,'Fusidic Acid': 0,'Gentamicin': 90,'Linezolid': 0,'Metronidazole': 0,'Minocycline': 0,'Nitrofurantoin': 0,'Rifampin': 0,'TMP-SMX': 0,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Tigecycline': 50,'Tobramycin': 90,'Trimethoprim': 0,'Vancomycin': 0},
        'Franciscella tularensis': {'Azithromycin': 0,'Chloramphenicol': 90,'Clarithromycin': 0,'Clindamycin': 0,'Daptomycin': 0,'Doxycycline': 90,'Erythromycin': 0,'Gentamicin': 90,'Linezolid': 0,'Metronidazole': 0,'Minocycline': 90,'Rifampin': 90,'TMP-SMX': 90,'Teicoplanin': 0,'Telavancin': 0,'Telithromycin': 0,'Trimethoprim': 90,'Vancomycin': 0},
        'Brucella': {'Azithromycin': 90,'Clarithromycin': 90,'Daptomycin': 0,'Doxycycline': 90,'Erythromycin': 90,'Fusidic Acid': 50,'Metronidazole': 0,'Minocycline': 90,'TMP-SMX': 90,'Telithromycin': 90,'Tigecycline': 90,'Trimethoprim': 90},
        'Vibrio vulnificus': {'Amikacin': 0,'Azithromycin': 90,'Chloramphenicol': 90,'Clarithromycin': 90,'Clindamycin': 50,'Doxycycline': 90,'Erythromycin': 90,'Fusidic Acid': 0,'Gentamicin': 0,'Linezolid': 90,'Metronidazole': 0,'Minocycline': 90,'Nitrofurantoin': 0,'Quinupristin-Dalfopristin': 90,'Rifampin': 90,'Telithromycin': 90,'Tigecycline': 90,'Tobramycin': 0,'Trimethoprim': 0},
        'Rickettsia': {'Amikacin': 90,'Azithromycin': 90,'Clarithromycin': 90,'Doxycycline': 0,'Linezolid': 0,'Metronidazole': 0,'Minocycline': 0,'Quinupristin-Dalfopristin': 0,'Tigecycline': 0},
        'Mycobacterium avium': {'Amikacin': 0,'Azithromycin': 90,'Chloramphenicol': 90,'Clarithromycin': 90,'Clindamycin': 90,'Doxycycline': 90,'Erythromycin': 90,'Fusidic Acid': 90,'Gentamicin': 0,'Metronidazole': 0,'Minocycline': 90,'Telavancin': 90,'Tobramycin': 0,'Vancomycin': 90},

        'Candida albicans': {'Fluconazole': 90,'Itraconazole': 90,'Voriconazole': 90,'Caspofungin': 90,'Amphotericin B': 90},
        'Candida glabrata': {'Fluconazole': 50,'Itraconazole': 50,'Voriconazole': 75,'Caspofungin': 90,'Amphotericin B': 80},
        'Candida parapsilosis': {'Fluconazole': 90,'Itraconazole': 90,'Voriconazole': 90,'Caspofungin': 80,'Amphotericin B': 90},
        'Candida krusei': {'Fluconazole': 0,'Itraconazole': 75,'Voriconazole': 80,'Caspofungin': 90,'Amphotericin B': 80},
        'Cryptococcus neoformans': {'Fluconazole': 90,'Itraconazole': 75,'Voriconazole': 90,'Caspofungin': 0,'Amphotericin B': 90},
        'Aspergillus fumigatus': {'Fluconazole': 0,'Itraconazole': 80,'Voriconazole': 90,'Caspofungin': 80,'Amphotericin B': 80},
        'Aspergillus flavus': {'Fluconazole': 0,'Itraconazole': 80,'Voriconazole': 90,'Caspofungin': 80,'Amphotericin B': 80},
        'Aspergillus terreus': {'Fluconazole': 0,'Itraconazole': 80,'Voriconazole': 90,'Caspofungin': 80,'Amphotericin B': 0},
        'Fusarium': {'Fluconazole': 0,'Itraconazole': 50,'Voriconazole': 80,'Caspofungin': 0,'Amphotericin B': 80},
        'Scedosporium apiospermum (Pseudoallescheria boydii)': {'Fluconazole': 0,'Itraconazole': 0,'Voriconazole': 90,'Caspofungin': 50,'Amphotericin B': 50},
        'Scedosporium prolificans': {'Fluconazole': 0,'Itraconazole': 0,'Voriconazole': 50,'Caspofungin': 0,'Amphotericin B': 50},
        'Trichosporon': {'Fluconazole': 50,'Itraconazole': 75,'Voriconazole': 80,'Caspofungin': 0,'Amphotericin B': 75},
        'Zygomycetes (Absidia, Mucor, Rhizopus)': {'Fluconazole': 0,'Itraconazole': 50,'Voriconazole': 0,'Caspofungin': 0,'Amphotericin B': 90},
        'Dematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)': {'Fluconazole': 50,'Itraconazole': 80,'Voriconazole': 90,'Caspofungin': 75,'Amphotericin B': 75},
        'Blastomyces dermatitidis': {'Fluconazole': 75,'Itraconazole': 90,'Voriconazole': 80,'Caspofungin': 0,'Amphotericin B': 90},
        'Coccidioides immitis/posadasii': {'Fluconazole': 90,'Itraconazole': 80,'Voriconazole': 80,'Caspofungin': 0,'Amphotericin B': 90},
        'Histoplasma capsulatum': {'Fluconazole': 75,'Itraconazole': 90,'Voriconazole': 80,'Caspofungin': 0,'Amphotericin B': 90},
        'Sporothrix schenckii': {'Fluconazole': 0,'Itraconazole': 80,'Voriconazole': 0,'Caspofungin': 0,'Amphotericin B': 90}
    };

/**
 * Dictionary storing raw relational data from pre-constructed antibiograms that user will be able to choose from or customize
 */
var SENSITIVITY_DATA_PER_SOURCE = {};
// Auto-build default data from table above
var dataStrArray = new Array();
for( var i=0; i < BUG_LIST.length; i++ )
{
    var bug = BUG_LIST[i];
    if ( bug in SENSITIVITY_TABLE_BY_BUG )
    {
        var bugSensPerDrug = SENSITIVITY_TABLE_BY_BUG[bug];

        for( var j=0; j < DRUG_LIST.length; j++ )
        {
            var drug = DRUG_LIST[j];
            if ( drug in bugSensPerDrug )
            {
                var sens = bugSensPerDrug[drug];
                dataStrArray.push(sens+'\t'+bug+'\t'+drug);
            }
        }
    }
}
SENSITIVITY_DATA_PER_SOURCE["Sanford2010"] = dataStrArray.join('\n');
SENSITIVITY_DATA_PER_SOURCE["default"] = SENSITIVITY_DATA_PER_SOURCE["Sanford2010"];

SENSITIVITY_DATA_PER_SOURCE["Stanford2011"] = ''+
    '322\tStreptococcus Group B (agalactiae)\tNumber Tested\n'+
    '107\tStreptococcus viridans Group\tNumber Tested\n'+
    '85\tStreptococcus pneumoniae\tNumber Tested\n'+
    '145\tEnterococcus (unspeciated)\tNumber Tested\n'+
    '69\tEnterococcus faecalis\tNumber Tested\n'+
    '56\tEnterococcus faecium\tNumber Tested\n'+

    '12\tEnterococcus faecium\tPenicillin G\n'+
    '12\tEnterococcus faecium\tAmpicillin/Amoxicillin\n'+
    '18\tEnterococcus (unspeciated)\tDoxycycline\n'+
    '27\tEnterococcus faecium\tVancomycin\n'+
    '43\tEnterococcus faecium\tDoxycycline\n'+
    '56\tStreptococcus Group B (agalactiae)\tErythromycin\n'+
    '59\tStreptococcus viridans Group\tErythromycin\n'+
    '62\tEnterococcus (unspeciated)\tCiprofloxacin\n'+
    '66\tStreptococcus Group B (agalactiae)\tClindamycin\n'+
    '69\tStreptococcus pneumoniae\tPenicillin G\n'+
    '69\tStreptococcus pneumoniae\tAmpicillin/Amoxicillin\n'+
    '74\tStreptococcus pneumoniae\tErythromycin\n'+
    '77\tStreptococcus pneumoniae\tTMP-SMX\n'+
    '81\tEnterococcus (unspeciated)\tPenicillin G\n'+
    '81\tEnterococcus (unspeciated)\tAmpicillin/Amoxicillin\n'+
    '82\tStreptococcus pneumoniae\tMeropenem\n'+
    '84\tStreptococcus viridans Group\tClindamycin\n'+
    '85\tStreptococcus pneumoniae\tClindamycin\n'+
    '86\tStreptococcus viridans Group\tPenicillin G\n'+
    '86\tStreptococcus viridans Group\tAmpicillin/Amoxicillin\n'+
    '89\tEnterococcus (unspeciated)\tNitrofurantoin\n'+
    '90\tEnterococcus faecium\tQuinupristin-Dalfopristin\n'+
    '94\tStreptococcus pneumoniae\tCefuroxime\n'+
    '95\tStreptococcus pneumoniae\tCeftriaxone\n'+
    '95\tEnterococcus (unspeciated)\tVancomycin\n'+
    '99\tStreptococcus viridans Group\tCeftriaxone\n'+
    '99\tEnterococcus faecalis\tLinezolid\n'+
    '99\tEnterococcus faecium\tLinezolid\n'+
    '100\tStreptococcus Group B (agalactiae)\tPenicillin G\n'+
    '100\tEnterococcus faecalis\tPenicillin G\n'+
    '100\tStreptococcus Group B (agalactiae)\tAmpicillin/Amoxicillin\n'+
    '100\tEnterococcus faecalis\tAmpicillin/Amoxicillin\n'+
    '100\tStreptococcus viridans Group\tVancomycin\n'+
    '100\tStreptococcus pneumoniae\tVancomycin\n'+
    '100\tEnterococcus faecalis\tVancomycin\n'+
    '100\tStreptococcus pneumoniae\tMoxifloxacin\n'+
    '100\tEnterococcus (unspeciated)\tLinezolid\n'+


    '594\tStaphylococcus aureus (all)\tNumber Tested\n'+
    '172\tStaphylococcus aureus (MRSA)\tNumber Tested\n'+
    '422\tStaphylococcus aureus (MSSA)\tNumber Tested\n'+
    '36\tStaphylococcus lugdunensis\tNumber Tested\n'+
    '533\tStaphylococcus, Coagulase Negative (epidermidis)\tNumber Tested\n'+
    '18\tStaphylococcus aureus (all)\tPenicillin G\n'+
    '0\tStaphylococcus aureus (MRSA)\tPenicillin G\n'+
    '27\tStaphylococcus aureus (MSSA)\tPenicillin G\n'+
    '55\tStaphylococcus lugdunensis\tPenicillin G\n'+
    '17\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin G\n'+
    '18\tStaphylococcus aureus (all)\tPenicillin V\n'+
    '0\tStaphylococcus aureus (MRSA)\tPenicillin V\n'+
    '27\tStaphylococcus aureus (MSSA)\tPenicillin V\n'+
    '55\tStaphylococcus lugdunensis\tPenicillin V\n'+
    '17\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin V\n'+
    '71\tStaphylococcus aureus (all)\tNafcillin/Oxacillin\n'+
    '0\tStaphylococcus aureus (MRSA)\tNafcillin/Oxacillin\n'+
    '100\tStaphylococcus aureus (MSSA)\tNafcillin/Oxacillin\n'+
    '94\tStaphylococcus lugdunensis\tNafcillin/Oxacillin\n'+
    '39\tStaphylococcus, Coagulase Negative (epidermidis)\tNafcillin/Oxacillin\n'+
    '71\tStaphylococcus aureus (all)\tCefazolin\n'+
    '0\tStaphylococcus aureus (MRSA)\tCefazolin\n'+
    '100\tStaphylococcus aureus (MSSA)\tCefazolin\n'+
    '94\tStaphylococcus lugdunensis\tCefazolin\n'+
    '39\tStaphylococcus, Coagulase Negative (epidermidis)\tCefazolin\n'+
    '71\tStaphylococcus aureus (all)\tCephalexin\n'+
    '0\tStaphylococcus aureus (MRSA)\tCephalexin\n'+
    '100\tStaphylococcus aureus (MSSA)\tCephalexin\n'+
    '94\tStaphylococcus lugdunensis\tCephalexin\n'+
    '39\tStaphylococcus, Coagulase Negative (epidermidis)\tCephalexin\n'+
    '100\tStaphylococcus aureus (all)\tVancomycin\n'+
    '100\tStaphylococcus aureus (MRSA)\tVancomycin\n'+
    '100\tStaphylococcus aureus (MSSA)\tVancomycin\n'+
    '100\tStaphylococcus lugdunensis\tVancomycin\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tVancomycin\n'+
    '51\tStaphylococcus aureus (all)\tErythromycin\n'+
    '6\tStaphylococcus aureus (MRSA)\tErythromycin\n'+
    '70\tStaphylococcus aureus (MSSA)\tErythromycin\n'+
    '77\tStaphylococcus lugdunensis\tErythromycin\n'+
    '37\tStaphylococcus, Coagulase Negative (epidermidis)\tErythromycin\n'+
    '72\tStaphylococcus aureus (all)\tClindamycin\n'+
    '46\tStaphylococcus aureus (MRSA)\tClindamycin\n'+
    '83\tStaphylococcus aureus (MSSA)\tClindamycin\n'+
    '84\tStaphylococcus lugdunensis\tClindamycin\n'+
    '58\tStaphylococcus, Coagulase Negative (epidermidis)\tClindamycin\n'+
    '98\tStaphylococcus aureus (all)\tGentamicin\n'+
    '98\tStaphylococcus aureus (MRSA)\tGentamicin\n'+
    '98\tStaphylococcus aureus (MSSA)\tGentamicin\n'+
    '100\tStaphylococcus lugdunensis\tGentamicin\n'+
    '75\tStaphylococcus, Coagulase Negative (epidermidis)\tGentamicin\n'+
    '99\tStaphylococcus aureus (all)\tTMP-SMX\n'+
    '99\tStaphylococcus aureus (MRSA)\tTMP-SMX\n'+
    '99\tStaphylococcus aureus (MSSA)\tTMP-SMX\n'+
    '100\tStaphylococcus lugdunensis\tTMP-SMX\n'+
    '62\tStaphylococcus, Coagulase Negative (epidermidis)\tTMP-SMX\n'+
    '68\tStaphylococcus aureus (all)\tMoxifloxacin\n'+
    '18\tStaphylococcus aureus (MRSA)\tMoxifloxacin\n'+
    '89\tStaphylococcus aureus (MSSA)\tMoxifloxacin\n'+
    '100\tStaphylococcus lugdunensis\tMoxifloxacin\n'+
    '49\tStaphylococcus, Coagulase Negative (epidermidis)\tMoxifloxacin\n'+
    '93\tStaphylococcus aureus (all)\tDoxycycline\n'+
    '93\tStaphylococcus aureus (MRSA)\tDoxycycline\n'+
    '93\tStaphylococcus aureus (MSSA)\tDoxycycline\n'+
    '100\tStaphylococcus aureus (all)\tLinezolid\n'+
    '100\tStaphylococcus aureus (MRSA)\tLinezolid\n'+
    '100\tStaphylococcus aureus (MSSA)\tLinezolid\n'+
    '100\tStaphylococcus lugdunensis\tLinezolid\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tLinezolid\n'+

    '9\tAchromobacter xylosoxidans\tNumber Tested\n'+
    '100\tAchromobacter xylosoxidans\tPiperacillin-Tazobactam\n'+
    '14\tAchromobacter xylosoxidans\tCefepime\n'+
    '0\tAchromobacter xylosoxidans\tAztreonam\n'+
    '86\tAchromobacter xylosoxidans\tImipenem\n'+
    '71\tAchromobacter xylosoxidans\tMeropenem\n'+
    '0\tAchromobacter xylosoxidans\tGentamicin\n'+
    '0\tAchromobacter xylosoxidans\tTobramycin\n'+
    '14\tAchromobacter xylosoxidans\tAmikacin\n'+
    '29\tAchromobacter xylosoxidans\tCiprofloxacin\n'+
    '71\tAchromobacter xylosoxidans\tLevofloxacin\n'+
    '86\tAchromobacter xylosoxidans\tTMP-SMX\n'+
    '7\tAcinetobacter\tNumber Tested\n'+
    '57\tAcinetobacter\tAmpicillin-Sulbactam\n'+
    '57\tAcinetobacter\tCefepime\n'+
    '86\tAcinetobacter\tMeropenem\n'+
    '86\tAcinetobacter\tGentamicin\n'+
    '92\tAcinetobacter\tTobramycin\n'+
    '92\tAcinetobacter\tAmikacin\n'+
    '71\tAcinetobacter\tCiprofloxacin\n'+
    '71\tAcinetobacter\tLevofloxacin\n'+
    '71\tAcinetobacter\tTMP-SMX\n'+
    '6\tCitrobacter freundii\tNumber Tested\n'+
    '0\tCitrobacter freundii\tAmpicillin/Amoxicillin\n'+
    '0\tCitrobacter freundii\tAmpicillin-Sulbactam\n'+
    '100\tCitrobacter freundii\tPiperacillin-Tazobactam\n'+
    '0\tCitrobacter freundii\tCefazolin\n'+
    '83\tCitrobacter freundii\tCefotaxime\n'+
    '100\tCitrobacter freundii\tCefepime\n'+
    '83\tCitrobacter freundii\tAztreonam\n'+
    '100\tCitrobacter freundii\tImipenem\n'+
    '100\tCitrobacter freundii\tMeropenem\n'+
    '100\tCitrobacter freundii\tGentamicin\n'+
    '100\tCitrobacter freundii\tTobramycin\n'+
    '100\tCitrobacter freundii\tAmikacin\n'+
    '100\tCitrobacter freundii\tCiprofloxacin\n'+
    '100\tCitrobacter freundii\tLevofloxacin\n'+
    '83\tCitrobacter freundii\tTMP-SMX\n'+
    '92\tCitrobacter freundii\tNitrofurantoin\n'+
    '10\tCitrobacter koseri\tNumber Tested\n'+
    '0\tCitrobacter koseri\tAmpicillin/Amoxicillin\n'+
    '0\tCitrobacter koseri\tAmpicillin-Sulbactam\n'+
    '100\tCitrobacter koseri\tPiperacillin-Tazobactam\n'+
    '100\tCitrobacter koseri\tCefazolin\n'+
    '100\tCitrobacter koseri\tCefotaxime\n'+
    '100\tCitrobacter koseri\tCefepime\n'+
    '100\tCitrobacter koseri\tAztreonam\n'+
    '100\tCitrobacter koseri\tImipenem\n'+
    '100\tCitrobacter koseri\tMeropenem\n'+
    '100\tCitrobacter koseri\tGentamicin\n'+
    '100\tCitrobacter koseri\tTobramycin\n'+
    '100\tCitrobacter koseri\tAmikacin\n'+
    '100\tCitrobacter koseri\tCiprofloxacin\n'+
    '100\tCitrobacter koseri\tLevofloxacin\n'+
    '100\tCitrobacter koseri\tTMP-SMX\n'+
    '60\tCitrobacter koseri\tNitrofurantoin\n'+
    '146\tEnterobacter aerogenes\tNumber Tested\n'+
    '0\tEnterobacter aerogenes\tAmpicillin/Amoxicillin\n'+
    '0\tEnterobacter aerogenes\tAmpicillin-Sulbactam\n'+
    '85\tEnterobacter aerogenes\tPiperacillin-Tazobactam\n'+
    '0\tEnterobacter aerogenes\tCefazolin\n'+
    '77\tEnterobacter aerogenes\tCefotaxime\n'+
    '100\tEnterobacter aerogenes\tCefepime\n'+
    '79\tEnterobacter aerogenes\tAztreonam\n'+
    '96\tEnterobacter aerogenes\tImipenem\n'+
    '98\tEnterobacter aerogenes\tMeropenem\n'+
    '96\tEnterobacter aerogenes\tGentamicin\n'+
    '98\tEnterobacter aerogenes\tTobramycin\n'+
    '100\tEnterobacter aerogenes\tAmikacin\n'+
    '91\tEnterobacter aerogenes\tCiprofloxacin\n'+
    '98\tEnterobacter aerogenes\tLevofloxacin\n'+
    '94\tEnterobacter aerogenes\tTMP-SMX\n'+
    '15\tEnterobacter aerogenes\tNitrofurantoin\n'+
    '26\tEnterobacter cloacae\tNumber Tested\n'+
    '0\tEnterobacter cloacae\tAmpicillin/Amoxicillin\n'+
    '0\tEnterobacter cloacae\tAmpicillin-Sulbactam\n'+
    '73\tEnterobacter cloacae\tPiperacillin-Tazobactam\n'+
    '0\tEnterobacter cloacae\tCefazolin\n'+
    '69\tEnterobacter cloacae\tCefotaxime\n'+
    '100\tEnterobacter cloacae\tCefepime\n'+
    '77\tEnterobacter cloacae\tAztreonam\n'+
    '100\tEnterobacter cloacae\tImipenem\n'+
    '100\tEnterobacter cloacae\tMeropenem\n'+
    '100\tEnterobacter cloacae\tGentamicin\n'+
    '100\tEnterobacter cloacae\tTobramycin\n'+
    '100\tEnterobacter cloacae\tAmikacin\n'+
    '100\tEnterobacter cloacae\tCiprofloxacin\n'+
    '100\tEnterobacter cloacae\tLevofloxacin\n'+
    '100\tEnterobacter cloacae\tTMP-SMX\n'+
    '31\tEnterobacter cloacae\tNitrofurantoin\n'+
    '3748\tEscheria coli\tNumber Tested\n'+
    '40\tEscheria coli\tAmpicillin/Amoxicillin\n'+
    '47\tEscheria coli\tAmpicillin-Sulbactam\n'+
    '88\tEscheria coli\tPiperacillin-Tazobactam\n'+
    '72\tEscheria coli\tCefazolin\n'+
    '89\tEscheria coli\tCefotaxime\n'+
    '90\tEscheria coli\tCefepime\n'+
    '89\tEscheria coli\tAztreonam\n'+
    '97\tEscheria coli\tImipenem\n'+
    '99\tEscheria coli\tMeropenem\n'+
    '84\tEscheria coli\tGentamicin\n'+
    '80\tEscheria coli\tTobramycin\n'+
    '99\tEscheria coli\tAmikacin\n'+
    '62\tEscheria coli\tCiprofloxacin\n'+
    '63\tEscheria coli\tLevofloxacin\n'+
    '66\tEscheria coli\tTMP-SMX\n'+
    '95\tEscheria coli\tNitrofurantoin\n'+
    '33\tKlebsiella oxytoca\tNumber Tested\n'+
    '0\tKlebsiella oxytoca\tAmpicillin/Amoxicillin\n'+
    '66\tKlebsiella oxytoca\tAmpicillin-Sulbactam\n'+
    '88\tKlebsiella oxytoca\tPiperacillin-Tazobactam\n'+
    '61\tKlebsiella oxytoca\tCefazolin\n'+
    '97\tKlebsiella oxytoca\tCefotaxime\n'+
    '100\tKlebsiella oxytoca\tCefepime\n'+
    '82\tKlebsiella oxytoca\tAztreonam\n'+
    '100\tKlebsiella oxytoca\tImipenem\n'+
    '100\tKlebsiella oxytoca\tMeropenem\n'+
    '100\tKlebsiella oxytoca\tGentamicin\n'+
    '100\tKlebsiella oxytoca\tTobramycin\n'+
    '100\tKlebsiella oxytoca\tAmikacin\n'+
    '97\tKlebsiella oxytoca\tCiprofloxacin\n'+
    '100\tKlebsiella oxytoca\tLevofloxacin\n'+
    '94\tKlebsiella oxytoca\tTMP-SMX\n'+
    '83\tKlebsiella oxytoca\tNitrofurantoin\n'+
    '753\tKlebsiella pneumoniae\tNumber Tested\n'+
    '0\tKlebsiella pneumoniae\tAmpicillin/Amoxicillin\n'+
    '83\tKlebsiella pneumoniae\tAmpicillin-Sulbactam\n'+
    '94\tKlebsiella pneumoniae\tPiperacillin-Tazobactam\n'+
    '83\tKlebsiella pneumoniae\tCefazolin\n'+
    '88\tKlebsiella pneumoniae\tCefotaxime\n'+
    '88\tKlebsiella pneumoniae\tCefepime\n'+
    '88\tKlebsiella pneumoniae\tAztreonam\n'+
    '97\tKlebsiella pneumoniae\tImipenem\n'+
    '99\tKlebsiella pneumoniae\tMeropenem\n'+
    '96\tKlebsiella pneumoniae\tGentamicin\n'+
    '89\tKlebsiella pneumoniae\tTobramycin\n'+
    '98\tKlebsiella pneumoniae\tAmikacin\n'+
    '89\tKlebsiella pneumoniae\tCiprofloxacin\n'+
    '90\tKlebsiella pneumoniae\tLevofloxacin\n'+
    '85\tKlebsiella pneumoniae\tTMP-SMX\n'+
    '24\tKlebsiella pneumoniae\tNitrofurantoin\n'+
    '7\tMorganella\tNumber Tested\n'+
    '0\tMorganella\tAmpicillin/Amoxicillin\n'+
    '0\tMorganella\tAmpicillin-Sulbactam\n'+
    '100\tMorganella\tPiperacillin-Tazobactam\n'+
    '0\tMorganella\tCefazolin\n'+
    '100\tMorganella\tCefotaxime\n'+
    '100\tMorganella\tCefepime\n'+
    '100\tMorganella\tAztreonam\n'+
    '100\tMorganella\tGentamicin\n'+
    '100\tMorganella\tTobramycin\n'+
    '100\tMorganella\tAmikacin\n'+
    '100\tMorganella\tCiprofloxacin\n'+
    '100\tMorganella\tTMP-SMX\n'+
    '0\tMorganella\tNitrofurantoin\n'+
    '26\tProteus mirabilis\tNumber Tested\n'+
    '89\tProteus mirabilis\tAmpicillin/Amoxicillin\n'+
    '96\tProteus mirabilis\tAmpicillin-Sulbactam\n'+
    '100\tProteus mirabilis\tPiperacillin-Tazobactam\n'+
    '89\tProteus mirabilis\tCefazolin\n'+
    '96\tProteus mirabilis\tCefotaxime\n'+
    '96\tProteus mirabilis\tCefepime\n'+
    '96\tProteus mirabilis\tAztreonam\n'+
    '92\tProteus mirabilis\tGentamicin\n'+
    '92\tProteus mirabilis\tTobramycin\n'+
    '100\tProteus mirabilis\tAmikacin\n'+
    '92\tProteus mirabilis\tCiprofloxacin\n'+
    '89\tProteus mirabilis\tTMP-SMX\n'+
    '0\tProteus mirabilis\tNitrofurantoin\n'+
    '2\tProteus vulgaris\tNumber Tested\n'+
    '0\tProteus vulgaris\tAmpicillin/Amoxicillin\n'+
    '87\tProteus vulgaris\tAmpicillin-Sulbactam\n'+
    '100\tProteus vulgaris\tPiperacillin-Tazobactam\n'+
    '0\tProteus vulgaris\tCefazolin\n'+
    '100\tProteus vulgaris\tCefepime\n'+
    '78\tProteus vulgaris\tAztreonam\n'+
    '100\tProteus vulgaris\tImipenem\n'+
    '100\tProteus vulgaris\tMeropenem\n'+
    '100\tProteus vulgaris\tGentamicin\n'+
    '100\tProteus vulgaris\tTobramycin\n'+
    '100\tProteus vulgaris\tAmikacin\n'+
    '83\tProteus vulgaris\tCiprofloxacin\n'+
    '100\tProteus vulgaris\tLevofloxacin\n'+
    '100\tProteus vulgaris\tTMP-SMX\n'+
    '0\tProteus vulgaris\tNitrofurantoin\n'+
    '605\tPseudomonas aeruginosa\tNumber Tested\n'+
    '94\tPseudomonas aeruginosa\tPiperacillin-Tazobactam\n'+
    '84\tPseudomonas aeruginosa\tCefepime\n'+
    '71\tPseudomonas aeruginosa\tAztreonam\n'+
    '86\tPseudomonas aeruginosa\tImipenem\n'+
    '90\tPseudomonas aeruginosa\tMeropenem\n'+
    '81\tPseudomonas aeruginosa\tGentamicin\n'+
    '96\tPseudomonas aeruginosa\tTobramycin\n'+
    '93\tPseudomonas aeruginosa\tAmikacin\n'+
    '73\tPseudomonas aeruginosa\tCiprofloxacin\n'+
    '69\tPseudomonas aeruginosa\tLevofloxacin\n'+
    '290\tPseudomonas aeruginosa CF mucoid\tNumber Tested\n'+
    '84\tPseudomonas aeruginosa CF mucoid\tPiperacillin\n'+
    '82\tPseudomonas aeruginosa CF mucoid\tCefepime\n'+
    '78\tPseudomonas aeruginosa CF mucoid\tAztreonam\n'+
    '80\tPseudomonas aeruginosa CF mucoid\tImipenem\n'+
    '82\tPseudomonas aeruginosa CF mucoid\tMeropenem\n'+
    '85\tPseudomonas aeruginosa CF mucoid\tTobramycin\n'+
    '63\tPseudomonas aeruginosa CF mucoid\tCiprofloxacin\n'+
    '278\tPseudomonas aeruginosa CF non-mucoid\tNumber Tested\n'+
    '77\tPseudomonas aeruginosa CF non-mucoid\tPiperacillin\n'+
    '71\tPseudomonas aeruginosa CF non-mucoid\tCefepime\n'+
    '70\tPseudomonas aeruginosa CF non-mucoid\tAztreonam\n'+
    '66\tPseudomonas aeruginosa CF non-mucoid\tImipenem\n'+
    '74\tPseudomonas aeruginosa CF non-mucoid\tMeropenem\n'+
    '59\tPseudomonas aeruginosa CF non-mucoid\tTobramycin\n'+
    '40\tPseudomonas aeruginosa CF non-mucoid\tCiprofloxacin\n'+
    '21\tSalmonella\tNumber Tested\n'+
    '81\tSalmonella\tAmpicillin/Amoxicillin\n'+
    '90\tSalmonella\tCiprofloxacin\n'+
    '95\tSalmonella\tTMP-SMX\n'+
    '39\tSerratia\tNumber Tested\n'+
    '0\tSerratia\tAmpicillin/Amoxicillin\n'+
    '0\tSerratia\tAmpicillin-Sulbactam\n'+
    '97\tSerratia\tPiperacillin-Tazobactam\n'+
    '0\tSerratia\tCefazolin\n'+
    '97\tSerratia\tCefotaxime\n'+
    '100\tSerratia\tCefepime\n'+
    '100\tSerratia\tAztreonam\n'+
    '100\tSerratia\tImipenem\n'+
    '100\tSerratia\tMeropenem\n'+
    '100\tSerratia\tGentamicin\n'+
    '97\tSerratia\tTobramycin\n'+
    '100\tSerratia\tAmikacin\n'+
    '90\tSerratia\tCiprofloxacin\n'+
    '95\tSerratia\tLevofloxacin\n'+
    '97\tSerratia\tTMP-SMX\n'+
    '0\tSerratia\tNitrofurantoin\n'+
    '49\tStenotrophomonas maltophilia\tNumber Tested\n'+
    '85\tStenotrophomonas maltophilia\tLevofloxacin\n'+
    '98\tStenotrophomonas maltophilia\tTMP-SMX\n'+

    '9\tBurkholderia cepacia\tNumber Tested\n'+
    '86\tBurkholderia cepacia\tCeftazidime\n'+
    '57\tBurkholderia cepacia\tMinocycline\n'+
    '79\tPseudomonas aeruginosa CF mucoid\tTicarcillin\n'+
    '74\tPseudomonas aeruginosa CF non-mucoid\tTicarcillin\n'+
    '95\tSalmonella\tCeftriaxone\n'+
    '50\tStenotrophomonas maltophilia\tTicarcillin-Clavulanate\n'+

    '46\tCampylobacter\tNumber Tested\n'+
    '70\tCampylobacter\tCiprofloxacin\n'+
    '65\tCampylobacter\tDoxycycline\n'+
    '96\tCampylobacter\tErythromycin\n'+

    '31\tBacteroides fragilis\tNumber Tested\n'+
    '90\tBacteroides fragilis\tAmpicillin-Sulbactam\n'+
    '0\tBacteroides fragilis\tPenicillin G\n'+
    '100\tBacteroides fragilis\tPiperacillin-Tazobactam\n'+
    '100\tBacteroides fragilis\tMeropenem\n'+
    '65\tBacteroides fragilis\tClindamycin\n'+
    '100\tBacteroides fragilis\tMetronidazole\n'+
    '26\tBacteroides (not fragilis)\tNumber Tested\n'+
    '73\tBacteroides (not fragilis)\tAmpicillin-Sulbactam\n'+
    '0\tBacteroides (not fragilis)\tPenicillin G\n'+
    '88\tBacteroides (not fragilis)\tPiperacillin-Tazobactam\n'+
    '100\tBacteroides (not fragilis)\tMeropenem\n'+
    '38\tBacteroides (not fragilis)\tClindamycin\n'+
    '96\tBacteroides (not fragilis)\tMetronidazole\n'+
    /*
    '27\tGram Negative Rods (other)\tNumber Tested\n'+
    '100\tGram Negative Rods (other)\tAmpicillin-Sulbactam\n'+
    '100\tGram Negative Rods (other)\tPenicillin G\n'+
    '100\tGram Negative Rods (other)\tPiperacillin-Tazobactam\n'+
    '100\tGram Negative Rods (other)\tMeropenem\n'+
    '81\tGram Negative Rods (other)\tClindamycin\n'+
    '100\tGram Negative Rods (other)\tMetronidazole\n'+
    '37\tGram Positive Rods (all)\tNumber Tested\n'+
    '100\tGram Positive Rods (all)\tAmpicillin-Sulbactam\n'+
    '81\tGram Positive Rods (all)\tPenicillin G\n'+
    '100\tGram Positive Rods (all)\tPiperacillin-Tazobactam\n'+
    '100\tGram Positive Rods (all)\tMeropenem\n'+
    '76\tGram Positive Rods (all)\tClindamycin\n'+
    '86\tGram Positive Rods (all)\tMetronidazole\n'+
    */
    '24\tPeptostreptococcus\tNumber Tested\n'+
    '100\tPeptostreptococcus\tPenicillin G\n'+
    '88\tPeptostreptococcus\tClindamycin\n'+
    '96\tPeptostreptococcus\tMetronidazole\n'+

    '100\tCandida albicans\tAmphotericin B\n'+
    '100\tCandida glabrata\tAmphotericin B\n'+
    '100\tCandida parapsilosis\tAmphotericin B\n'+
    '100\tCandida krusei\tAmphotericin B\n'+
    '100\tCandida (other)\tAmphotericin B\n'+
    '100\tCandida albicans\tCaspofungin\n'+
    '95\tCandida glabrata\tCaspofungin\n'+
    '100\tCandida parapsilosis\tCaspofungin\n'+
    '100\tCandida krusei\tCaspofungin\n'+
    '96\tCandida (other)\tCaspofungin\n'+
    '95\tCandida albicans\tFluconazole\n'+
    '80\tCandida glabrata\tFluconazole\n'+
    '100\tCandida parapsilosis\tFluconazole\n'+
    '0\tCandida krusei\tFluconazole\n'+
    '87\tCandida (other)\tFluconazole\n'+
    '96\tCandida albicans\tItraconazole\n'+
    '44\tCandida glabrata\tItraconazole\n'+
    '100\tCandida parapsilosis\tItraconazole\n'+
    '100\tCandida krusei\tItraconazole\n'+
    '87\tCandida (other)\tItraconazole\n'+
    '96\tCandida albicans\tVoriconazole\n'+
    '87\tCandida glabrata\tVoriconazole\n'+
    '100\tCandida parapsilosis\tVoriconazole\n'+
    '100\tCandida krusei\tVoriconazole\n'+
    '87\tCandida (other)\tVoriconazole\n'+
    '101\tCandida albicans\tNumber Tested\n'+
    '55\tCandida glabrata\tNumber Tested\n'+
    '30\tCandida parapsilosis\tNumber Tested\n'+
    '4\tCandida krusei\tNumber Tested\n'+
    '23\tCandida (other)\tNumber Tested\n'+
    '';
SENSITIVITY_DATA_PER_SOURCE["PAVA2011-ED"] = ''+
    '12\tEnterococcus faecalis\tNumber Tested\n'+
    '100\tEnterococcus faecalis\tAmpicillin/Amoxicillin\n'+
    '100\tEnterococcus faecalis\tPenicillin G\n'+
    '17\tEnterococcus faecalis\tErythromycin\n'+
    '92\tEnterococcus faecalis\tLinezolid\n'+
    '100\tEnterococcus faecalis\tNitrofurantoin\n'+
    '100\tEnterococcus faecalis\tVancomycin\n'+
    '83\tEnterococcus (unspeciated)\tNumber Tested\n'+
    '100\tEnterococcus (unspeciated)\tAmpicillin/Amoxicillin\n'+
    '98\tEnterococcus (unspeciated)\tPenicillin G\n'+
    '67\tEnterococcus (unspeciated)\tLevofloxacin\n'+
    '0\tEnterococcus (unspeciated)\tClindamycin\n'+
    '19\tEnterococcus (unspeciated)\tErythromycin\n'+
    '94\tEnterococcus (unspeciated)\tLinezolid\n'+
    '96\tEnterococcus (unspeciated)\tNitrofurantoin\n'+
    '98\tEnterococcus (unspeciated)\tVancomycin\n'+
    '237\tStaphylococcus aureus (all)\tNumber Tested\n'+
    '49\tStaphylococcus aureus (all)\tNafcillin/Oxacillin\n'+
    '1\tStaphylococcus aureus (all)\tPenicillin G\n'+
    '51\tStaphylococcus aureus (all)\tLevofloxacin\n'+
    '51\tStaphylococcus aureus (all)\tMoxifloxacin\n'+
    '79\tStaphylococcus aureus (all)\tClindamycin\n'+
    '39\tStaphylococcus aureus (all)\tErythromycin\n'+
    '100\tStaphylococcus aureus (all)\tLinezolid\n'+
    '100\tStaphylococcus aureus (all)\tRifampin\n'+
    '98\tStaphylococcus aureus (all)\tTMP-SMX\n'+
    '100\tStaphylococcus aureus (all)\tVancomycin\n'+
    '22\tStaphylococcus capitis\tNumber Tested\n'+
    '86\tStaphylococcus capitis\tNafcillin/Oxacillin\n'+
    '10\tStaphylococcus capitis\tPenicillin G\n'+
    '82\tStaphylococcus capitis\tLevofloxacin\n'+
    '82\tStaphylococcus capitis\tMoxifloxacin\n'+
    '76\tStaphylococcus capitis\tClindamycin\n'+
    '68\tStaphylococcus capitis\tErythromycin\n'+
    '100\tStaphylococcus capitis\tLinezolid\n'+
    '100\tStaphylococcus capitis\tNitrofurantoin\n'+
    '100\tStaphylococcus capitis\tRifampin\n'+
    '100\tStaphylococcus capitis\tTMP-SMX\n'+
    '100\tStaphylococcus capitis\tVancomycin\n'+
    '31\tStaphylococcus hominis\tNumber Tested\n'+
    '65\tStaphylococcus hominis\tNafcillin/Oxacillin\n'+
    '10\tStaphylococcus hominis\tPenicillin G\n'+
    '74\tStaphylococcus hominis\tLevofloxacin\n'+
    '74\tStaphylococcus hominis\tMoxifloxacin\n'+
    '74\tStaphylococcus hominis\tClindamycin\n'+
    '45\tStaphylococcus hominis\tErythromycin\n'+
    '100\tStaphylococcus hominis\tLinezolid\n'+
    '100\tStaphylococcus hominis\tNitrofurantoin\n'+
    '100\tStaphylococcus hominis\tRifampin\n'+
    '79\tStaphylococcus hominis\tTMP-SMX\n'+
    '100\tStaphylococcus hominis\tVancomycin\n'+
    '10\tStaphylococcus lugdunensis\tNumber Tested\n'+
    '65\tStaphylococcus lugdunensis\tNafcillin/Oxacillin\n'+
    '10\tStaphylococcus lugdunensis\tPenicillin G\n'+
    '100\tStaphylococcus lugdunensis\tLevofloxacin\n'+
    '100\tStaphylococcus lugdunensis\tMoxifloxacin\n'+
    '80\tStaphylococcus lugdunensis\tClindamycin\n'+
    '80\tStaphylococcus lugdunensis\tErythromycin\n'+
    '100\tStaphylococcus lugdunensis\tLinezolid\n'+
    '100\tStaphylococcus lugdunensis\tNitrofurantoin\n'+
    '90\tStaphylococcus lugdunensis\tRifampin\n'+
    '100\tStaphylococcus lugdunensis\tTMP-SMX\n'+
    '100\tStaphylococcus lugdunensis\tVancomycin\n'+
    '37\tStaphylococcus, Coagulase Negative (epidermidis)\tNumber Tested\n'+
    '54\tStaphylococcus, Coagulase Negative (epidermidis)\tNafcillin/Oxacillin\n'+
    '5\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin G\n'+
    '51\tStaphylococcus, Coagulase Negative (epidermidis)\tLevofloxacin\n'+
    '51\tStaphylococcus, Coagulase Negative (epidermidis)\tMoxifloxacin\n'+
    '70\tStaphylococcus, Coagulase Negative (epidermidis)\tClindamycin\n'+
    '57\tStaphylococcus, Coagulase Negative (epidermidis)\tErythromycin\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tLinezolid\n'+
    '97\tStaphylococcus, Coagulase Negative (epidermidis)\tNitrofurantoin\n'+
    '97\tStaphylococcus, Coagulase Negative (epidermidis)\tRifampin\n'+
    '60\tStaphylococcus, Coagulase Negative (epidermidis)\tTMP-SMX\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tVancomycin\n'+
    '12\tStreptococcus pneumoniae\tNumber Tested\n'+
    '92\tStreptococcus pneumoniae\tPenicillin G\n'+
    '100\tStreptococcus pneumoniae\tLevofloxacin\n'+
    '100\tStreptococcus pneumoniae\tMoxifloxacin\n'+
    '100\tStreptococcus pneumoniae\tLinezolid\n'+
    '100\tStreptococcus pneumoniae\tTMP-SMX\n'+
    '100\tStreptococcus pneumoniae\tVancomycin\n'+
    '100\tStreptococcus pneumoniae\tAmpicillin/Amoxicillin\n'+
    '100\tStreptococcus pneumoniae\tCeftriaxone\n'+
    '100\tStreptococcus pneumoniae\tErtapenem\n'+
    '12\tCitrobacter freundii\tNumber Tested\n'+
    '0\tCitrobacter freundii\tCefazolin\n'+
    '100\tCitrobacter freundii\tCefepime\n'+
    '75\tCitrobacter freundii\tCeftazidime\n'+
    '75\tCitrobacter freundii\tCeftriaxone\n'+
    '100\tCitrobacter freundii\tAmikacin\n'+
    '92\tCitrobacter freundii\tGentamicin\n'+
    '92\tCitrobacter freundii\tTobramycin\n'+
    '92\tCitrobacter freundii\tCiprofloxacin\n'+
    '92\tCitrobacter freundii\tLevofloxacin\n'+
    '92\tCitrobacter freundii\tNitrofurantoin\n'+
    '100\tCitrobacter freundii\tErtapenem\n'+
    '100\tCitrobacter freundii\tImipenem\n'+
    '83\tCitrobacter freundii\tTMP-SMX\n'+
    '21\tEnterobacter cloacae\tNumber Tested\n'+
    '86\tEnterobacter cloacae\tPiperacillin-Tazobactam\n'+
    '0\tEnterobacter cloacae\tCefazolin\n'+
    '100\tEnterobacter cloacae\tCefepime\n'+
    '90\tEnterobacter cloacae\tCeftazidime\n'+
    '86\tEnterobacter cloacae\tCeftriaxone\n'+
    '100\tEnterobacter cloacae\tAmikacin\n'+
    '95\tEnterobacter cloacae\tGentamicin\n'+
    '95\tEnterobacter cloacae\tTobramycin\n'+
    '90\tEnterobacter cloacae\tCiprofloxacin\n'+
    '90\tEnterobacter cloacae\tLevofloxacin\n'+
    '83\tEnterobacter cloacae\tAztreonam\n'+
    '33\tEnterobacter cloacae\tNitrofurantoin\n'+
    '95\tEnterobacter cloacae\tErtapenem\n'+
    '95\tEnterobacter cloacae\tImipenem\n'+
    '100\tEnterobacter cloacae\tMeropenem\n'+
    '90\tEnterobacter cloacae\tTMP-SMX\n'+
    '233\tEscheria coli\tNumber Tested\n'+
    '50\tEscheria coli\tAmpicillin/Amoxicillin\n'+
    '66\tEscheria coli\tAmpicillin-Sulbactam\n'+
    '93\tEscheria coli\tPiperacillin-Tazobactam\n'+
    '87\tEscheria coli\tCefazolin\n'+
    '97\tEscheria coli\tCefepime\n'+
    '96\tEscheria coli\tCeftazidime\n'+
    '95\tEscheria coli\tCeftriaxone\n'+
    '100\tEscheria coli\tAmikacin\n'+
    '90\tEscheria coli\tGentamicin\n'+
    '91\tEscheria coli\tTobramycin\n'+
    '69\tEscheria coli\tCiprofloxacin\n'+
    '69\tEscheria coli\tLevofloxacin\n'+
    '96\tEscheria coli\tAztreonam\n'+
    '98\tEscheria coli\tNitrofurantoin\n'+
    '100\tEscheria coli\tErtapenem\n'+
    '99\tEscheria coli\tImipenem\n'+
    '100\tEscheria coli\tMeropenem\n'+
    '75\tEscheria coli\tTMP-SMX\n'+
    '75\tKlebsiella pneumoniae\tNumber Tested\n'+
    '0\tKlebsiella pneumoniae\tAmpicillin/Amoxicillin\n'+
    '77\tKlebsiella pneumoniae\tAmpicillin-Sulbactam\n'+
    '91\tKlebsiella pneumoniae\tPiperacillin-Tazobactam\n'+
    '88\tKlebsiella pneumoniae\tCefazolin\n'+
    '92\tKlebsiella pneumoniae\tCefepime\n'+
    '91\tKlebsiella pneumoniae\tCeftazidime\n'+
    '92\tKlebsiella pneumoniae\tCeftriaxone\n'+
    '100\tKlebsiella pneumoniae\tAmikacin\n'+
    '95\tKlebsiella pneumoniae\tGentamicin\n'+
    '93\tKlebsiella pneumoniae\tTobramycin\n'+
    '89\tKlebsiella pneumoniae\tCiprofloxacin\n'+
    '89\tKlebsiella pneumoniae\tLevofloxacin\n'+
    '91\tKlebsiella pneumoniae\tAztreonam\n'+
    '28\tKlebsiella pneumoniae\tNitrofurantoin\n'+
    '100\tKlebsiella pneumoniae\tErtapenem\n'+
    '100\tKlebsiella pneumoniae\tImipenem\n'+
    '100\tKlebsiella pneumoniae\tMeropenem\n'+
    '80\tKlebsiella pneumoniae\tTMP-SMX\n'+
    '17\tMorganella\tNumber Tested\n'+
    '0\tMorganella\tAmpicillin/Amoxicillin\n'+
    '6\tMorganella\tAmpicillin-Sulbactam\n'+
    '82\tMorganella\tPiperacillin-Tazobactam\n'+
    '12\tMorganella\tCefazolin\n'+
    '100\tMorganella\tCefepime\n'+
    '76\tMorganella\tCeftazidime\n'+
    '100\tMorganella\tCeftriaxone\n'+
    '100\tMorganella\tAmikacin\n'+
    '76\tMorganella\tGentamicin\n'+
    '82\tMorganella\tTobramycin\n'+
    '41\tMorganella\tCiprofloxacin\n'+
    '65\tMorganella\tLevofloxacin\n'+
    '86\tMorganella\tAztreonam\n'+
    '0\tMorganella\tNitrofurantoin\n'+
    '100\tMorganella\tErtapenem\n'+
    '100\tMorganella\tMeropenem\n'+
    '41\tMorganella\tTMP-SMX\n'+
    '44\tProteus mirabilis\tNumber Tested\n'+
    '79\tProteus mirabilis\tAmpicillin/Amoxicillin\n'+
    '93\tProteus mirabilis\tAmpicillin-Sulbactam\n'+
    '98\tProteus mirabilis\tPiperacillin-Tazobactam\n'+
    '95\tProteus mirabilis\tCefazolin\n'+
    '95\tProteus mirabilis\tCefepime\n'+
    '95\tProteus mirabilis\tCeftazidime\n'+
    '95\tProteus mirabilis\tCeftriaxone\n'+
    '100\tProteus mirabilis\tAmikacin\n'+
    '91\tProteus mirabilis\tGentamicin\n'+
    '93\tProteus mirabilis\tTobramycin\n'+
    '82\tProteus mirabilis\tCiprofloxacin\n'+
    '82\tProteus mirabilis\tLevofloxacin\n'+
    '93\tProteus mirabilis\tAztreonam\n'+
    '0\tProteus mirabilis\tNitrofurantoin\n'+
    '100\tProteus mirabilis\tErtapenem\n'+
    '100\tProteus mirabilis\tMeropenem\n'+
    '84\tProteus mirabilis\tTMP-SMX\n'+
    '72\tPseudomonas aeruginosa\tNumber Tested\n'+
    '0\tPseudomonas aeruginosa\tAmpicillin/Amoxicillin\n'+
    '0\tPseudomonas aeruginosa\tAmpicillin-Sulbactam\n'+
    '94\tPseudomonas aeruginosa\tPiperacillin-Tazobactam\n'+
    '0\tPseudomonas aeruginosa\tCefazolin\n'+
    '86\tPseudomonas aeruginosa\tCefepime\n'+
    '89\tPseudomonas aeruginosa\tCeftazidime\n'+
    '0\tPseudomonas aeruginosa\tCeftriaxone\n'+
    '97\tPseudomonas aeruginosa\tAmikacin\n'+
    '89\tPseudomonas aeruginosa\tGentamicin\n'+
    '96\tPseudomonas aeruginosa\tTobramycin\n'+
    '82\tPseudomonas aeruginosa\tCiprofloxacin\n'+
    '77\tPseudomonas aeruginosa\tLevofloxacin\n'+
    '0\tPseudomonas aeruginosa\tNitrofurantoin\n'+
    '96\tPseudomonas aeruginosa\tImipenem\n'+
    '95\tPseudomonas aeruginosa\tMeropenem\n'+
    '0\tPseudomonas aeruginosa\tTMP-SMX\n'+
    '10\tSerratia marcescens\tNumber Tested\n'+
    '100\tSerratia marcescens\tPiperacillin-Tazobactam\n'+
    '0\tSerratia marcescens\tCefazolin\n'+
    '100\tSerratia marcescens\tCefepime\n'+
    '100\tSerratia marcescens\tCeftazidime\n'+
    '100\tSerratia marcescens\tCeftriaxone\n'+
    '100\tSerratia marcescens\tAmikacin\n'+
    '100\tSerratia marcescens\tGentamicin\n'+
    '100\tSerratia marcescens\tTobramycin\n'+
    '100\tSerratia marcescens\tCiprofloxacin\n'+
    '100\tSerratia marcescens\tLevofloxacin\n'+
    '0\tSerratia marcescens\tNitrofurantoin\n'+
    '100\tSerratia marcescens\tErtapenem\n'+
    '100\tSerratia marcescens\tImipenem\n'+
    '100\tSerratia marcescens\tTMP-SMX\n'+
    '10\tStenotrophomonas maltophilia\tNumber Tested\n'+
    '90\tStenotrophomonas maltophilia\tTMP-SMX\n'+
    '';
