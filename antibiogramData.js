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
        'Nitrofurantoin (uncomplicated UTI)',
        'Fosfomycin',
        'Rifampin (not for Staph monotherapy)',
        'Metronidazole',
        'Quinupristin-Dalfopristin',
        'Linezolid',
        'Daptomycin (non-pneumonia)',
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
        'Nitrofurantoin (uncomplicated UTI)': ['Urinary Tract','Oral Available'],
        'Fosfomycin': ['Urinary Tract'],
        'Rifampin (not for Staph monotherapy)': ['Miscellaneous','Oral Available'],
        'Metronidazole': ['Miscellaneous','Oral Available'],
        'Quinupristin-Dalfopristin': ['Miscellaneous'],
        'Linezolid': ['Miscellaneous','Oral Available'],
        'Daptomycin (non-pneumonia)': ['Miscellaneous'],
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
        'Clostridium difficile (not Enterocolitis)',
        'Clostridium (not difficile)',
        'Peptostreptococcus',

        // Additional elements from local Antibiograms
        'Streptococcus Group B (agalactiae)',
        'Enterococcus (unspeciated)',
        'Enterococcus (VRE)',

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
        'Gram Negative Rods (anaerobes, other)',
        'Gram Positive Rods (anaerobes)',
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
        'Clostridium difficile (not Enterocolitis)': ['Anaerobe','Gram Positive Rods'],
        'Clostridium (not difficile)': ['Anaerobe','Gram Positive Rods'],
        'Peptostreptococcus': ['Anaerobe'],


        'Streptococcus Group B (agalactiae)': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Enterococcus (unspeciated)': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],
        'Enterococcus (VRE)': ['Gram Positive','Gram Positive Cocci in Pairs / Chains'],

        'Achromobacter xylosoxidans': ['Gram Negative'],
        'Citrobacter koseri': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Enterobacter aerogenes': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Enterobacter cloacae': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Klebsiella oxytoca': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Klebsiella pneumoniae': ['Gram Negative','Gram Negative Rods, Lactose Fermenting'],
        'Pseudomonas aeruginosa CF mucoid': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting','Gram Negative Rods, Non-Fermenting'],
        'Pseudomonas aeruginosa CF non-mucoid': ['Gram Negative','Gram Negative Rods, Non-Lactose Fermenting','Gram Negative Rods, Non-Fermenting'],

        'Staphylococcus aureus (all)': ['Gram Positive','Gram Positive Cocci in Clusters'],
        'Staphylococcus lugdunensis': ['Gram Positive','Gram Positive Cocci in Clusters','Gram Positive Cocci in Clusters, Coagulase Negative'],

        'Bacteroides (not fragilis)': ['Anaerobe'],
        'Gram Negative Rods (anaerobes, other)': ['Gram Negative','Anaerobe'],
        'Gram Positive Rods (anaerobes)': ['Gram Positive','Gram Positive Rods','Anaerobe'],
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
    };

/**
 * Dictionary storing raw relational data from pre-constructed antibiograms that user will be able to choose from or customize
 */
var SENSITIVITY_DATA_PER_SOURCE = {};
/*
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
                bugSensPerDrug[drug] = {'value':sens,'comment':null};	// Convert to valueMap format
                dataStrArray.push(sens+'\t'+bug+'\t'+drug);
            }
        }
    }
}
*/

SENSITIVITY_DATA_PER_SOURCE["Sanford2010"] = ''+
	'90\tAcinetobacter\tAmikacin\n'+
	'0\tAcinetobacter\tAmoxicillin-Clavulanate\n'+
	'90\tAcinetobacter\tAmpicillin-Sulbactam\n'+
	'0\tAcinetobacter\tAmpicillin/Amoxicillin\n'+
	'0\tAcinetobacter\tAzithromycin\n'+
	'0\tAcinetobacter\tAztreonam\n'+
	'0\tAcinetobacter\tCefaclor/Loracarbef\n'+
	'0\tAcinetobacter\tCefadroxil\n'+
	'0\tAcinetobacter\tCefazolin\n'+
	'50\tAcinetobacter\tCefepime\n'+
	'0\tAcinetobacter\tCefixime\n'+
	'0\tAcinetobacter\tCefotaxime\n'+
	'0\tAcinetobacter\tCefotetan\n'+
	'0\tAcinetobacter\tCefoxitin\n'+
	'0\tAcinetobacter\tCefprozil\n'+
	'50\tAcinetobacter\tCeftazidime\n'+
	'0\tAcinetobacter\tCeftibuten\n'+
	'0\tAcinetobacter\tCeftizoxime\n'+
	'50\tAcinetobacter\tCeftobiprole\n'+
	'0\tAcinetobacter\tCeftriaxone\n'+
	'0\tAcinetobacter\tCefuroxime\n'+
	'0\tAcinetobacter\tCephalexin\n'+
	'0\tAcinetobacter\tChloramphenicol\n'+
	'50\tAcinetobacter\tCiprofloxacin\n'+
	'0\tAcinetobacter\tClarithromycin\n'+
	'0\tAcinetobacter\tClindamycin\n'+
	'0\tAcinetobacter\tCloxacillin/Dicloxacilin\n'+
	'90\tAcinetobacter\tColistimethate\n'+
	'0\tAcinetobacter\tDaptomycin (non-pneumonia)\n'+
	'50\tAcinetobacter\tDoripenem\n'+
	'0\tAcinetobacter\tDoxycycline\n'+
	'0\tAcinetobacter\tErtapenem\n'+
	'0\tAcinetobacter\tErythromycin\n'+
	'0\tAcinetobacter\tFusidic Acid\n'+
	'50\tAcinetobacter\tGatifloxacin\n'+
	'50\tAcinetobacter\tGemifloxacin\n'+
	'90\tAcinetobacter\tGentamicin\n'+
	'50\tAcinetobacter\tImipenem\n'+
	'50\tAcinetobacter\tLevofloxacin\n'+
	'0\tAcinetobacter\tLinezolid\n'+
	'50\tAcinetobacter\tMeropenem\n'+
	'0\tAcinetobacter\tMethicillin\n'+
	'0\tAcinetobacter\tMetronidazole\n'+
	'0\tAcinetobacter\tMinocycline\n'+
	'50\tAcinetobacter\tMoxifloxacin\n'+
	'0\tAcinetobacter\tNafcillin/Oxacillin\n'+
	'0\tAcinetobacter\tNitrofurantoin (uncomplicated UTI)\n'+
	'50\tAcinetobacter\tOfloxacin\n'+
	'0\tAcinetobacter\tPenicillin G\n'+
	'0\tAcinetobacter\tPenicillin V\n'+
	'0\tAcinetobacter\tPiperacillin\n'+
	'50\tAcinetobacter\tPiperacillin-Tazobactam\n'+
	'0\tAcinetobacter\tQuinupristin-Dalfopristin\n'+
	'0\tAcinetobacter\tRifampin (not for Staph monotherapy)\n'+
	'0\tAcinetobacter\tTMP-SMX\n'+
	'0\tAcinetobacter\tTeicoplanin\n'+
	'0\tAcinetobacter\tTelavancin\n'+
	'0\tAcinetobacter\tTelithromycin\n'+
	'0\tAcinetobacter\tTicarcillin\n'+
	'50\tAcinetobacter\tTicarcillin-Clavulanate\n'+
	'0\tAcinetobacter\tTigecycline\n'+
	'90\tAcinetobacter\tTobramycin\n'+
	'0\tAcinetobacter\tTrimethoprim\n'+
	'0\tAcinetobacter\tVancomycin\n'+
	'0\tActinomyces\tAmikacin\n'+
	'90\tActinomyces\tAmoxicillin-Clavulanate\n'+
	'90\tActinomyces\tAmpicillin-Sulbactam\n'+
	'90\tActinomyces\tAmpicillin/Amoxicillin\n'+
	'0\tActinomyces\tAzithromycin\n'+
	'0\tActinomyces\tAztreonam\n'+
	'90\tActinomyces\tCeftizoxime\n'+
	'90\tActinomyces\tCeftriaxone\n'+
	'90\tActinomyces\tChloramphenicol\n'+
	'0\tActinomyces\tCiprofloxacin\n'+
	'0\tActinomyces\tClarithromycin\n'+
	'50\tActinomyces\tClindamycin\n'+
	'0\tActinomyces\tCloxacillin/Dicloxacilin\n'+
	'50\tActinomyces\tDoxycycline\n'+
	'90\tActinomyces\tErtapenem\n'+
	'0\tActinomyces\tErythromycin\n'+
	'90\tActinomyces\tGatifloxacin\n'+
	'0\tActinomyces\tGentamicin\n'+
	'90\tActinomyces\tImipenem\n'+
	'50\tActinomyces\tLinezolid\n'+
	'0\tActinomyces\tMethicillin\n'+
	'90\tActinomyces\tMetronidazole\n'+
	'50\tActinomyces\tMinocycline\n'+
	'90\tActinomyces\tMoxifloxacin\n'+
	'0\tActinomyces\tNafcillin/Oxacillin\n'+
	'50\tActinomyces\tOfloxacin\n'+
	'90\tActinomyces\tPenicillin G\n'+
	'50\tActinomyces\tPenicillin V\n'+
	'90\tActinomyces\tPiperacillin\n'+
	'0\tActinomyces\tTMP-SMX\n'+
	'0\tActinomyces\tTelavancin\n'+
	'90\tActinomyces\tTigecycline\n'+
	'0\tActinomyces\tTobramycin\n'+
	'90\tActinomyces\tTrimethoprim\n'+
	'0\tActinomyces\tVancomycin\n'+
	'90\tAeromonas\tAmikacin\n'+
	'90\tAeromonas\tAmoxicillin-Clavulanate\n'+
	'90\tAeromonas\tAmpicillin-Sulbactam\n'+
	'0\tAeromonas\tAmpicillin/Amoxicillin\n'+
	'0\tAeromonas\tAzithromycin\n'+
	'90\tAeromonas\tAztreonam\n'+
	'0\tAeromonas\tCefazolin\n'+
	'90\tAeromonas\tCefepime\n'+
	'90\tAeromonas\tCefixime\n'+
	'90\tAeromonas\tCefotaxime\n'+
	'90\tAeromonas\tCefotetan\n'+
	'50\tAeromonas\tCefoxitin\n'+
	'90\tAeromonas\tCeftaroline\n'+
	'90\tAeromonas\tCeftazidime\n'+
	'90\tAeromonas\tCeftibuten\n'+
	'90\tAeromonas\tCeftizoxime\n'+
	'90\tAeromonas\tCeftobiprole\n'+
	'90\tAeromonas\tCeftriaxone\n'+
	'90\tAeromonas\tCefuroxime\n'+
	'90\tAeromonas\tChloramphenicol\n'+
	'90\tAeromonas\tCiprofloxacin\n'+
	'0\tAeromonas\tClarithromycin\n'+
	'0\tAeromonas\tClindamycin\n'+
	'0\tAeromonas\tCloxacillin/Dicloxacilin\n'+
	'90\tAeromonas\tColistimethate\n'+
	'0\tAeromonas\tDaptomycin (non-pneumonia)\n'+
	'90\tAeromonas\tDoripenem\n'+
	'90\tAeromonas\tDoxycycline\n'+
	'90\tAeromonas\tErtapenem\n'+
	'0\tAeromonas\tErythromycin\n'+
	'90\tAeromonas\tFosfomycin\n'+
	'0\tAeromonas\tFusidic Acid\n'+
	'90\tAeromonas\tGemifloxacin\n'+
	'90\tAeromonas\tGentamicin\n'+
	'90\tAeromonas\tImipenem\n'+
	'0\tAeromonas\tLinezolid\n'+
	'90\tAeromonas\tMeropenem\n'+
	'0\tAeromonas\tMethicillin\n'+
	'0\tAeromonas\tMetronidazole\n'+
	'90\tAeromonas\tMinocycline\n'+
	'90\tAeromonas\tMoxifloxacin\n'+
	'0\tAeromonas\tNafcillin/Oxacillin\n'+
	'90\tAeromonas\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tAeromonas\tOfloxacin\n'+
	'90\tAeromonas\tPefloxacin\n'+
	'0\tAeromonas\tPenicillin G\n'+
	'0\tAeromonas\tPenicillin V\n'+
	'90\tAeromonas\tPiperacillin\n'+
	'90\tAeromonas\tPiperacillin-Tazobactam\n'+
	'0\tAeromonas\tQuinupristin-Dalfopristin\n'+
	'0\tAeromonas\tRifampin (not for Staph monotherapy)\n'+
	'50\tAeromonas\tTMP-SMX\n'+
	'0\tAeromonas\tTeicoplanin\n'+
	'0\tAeromonas\tTelavancin\n'+
	'0\tAeromonas\tTelithromycin\n'+
	'90\tAeromonas\tTicarcillin\n'+
	'90\tAeromonas\tTicarcillin-Clavulanate\n'+
	'90\tAeromonas\tTigecycline\n'+
	'90\tAeromonas\tTobramycin\n'+
	'90\tAeromonas\tTrimethoprim\n'+
	'0\tAeromonas\tVancomycin\n'+
	'80\tAspergillus flavus\tAmphotericin B\n'+
	'80\tAspergillus flavus\tCaspofungin\n'+
	'0\tAspergillus flavus\tFluconazole\n'+
	'80\tAspergillus flavus\tItraconazole\n'+
	'90\tAspergillus flavus\tVoriconazole\n'+
	'80\tAspergillus fumigatus\tAmphotericin B\n'+
	'80\tAspergillus fumigatus\tCaspofungin\n'+
	'0\tAspergillus fumigatus\tFluconazole\n'+
	'80\tAspergillus fumigatus\tItraconazole\n'+
	'90\tAspergillus fumigatus\tVoriconazole\n'+
	'0\tAspergillus terreus\tAmphotericin B\n'+
	'80\tAspergillus terreus\tCaspofungin\n'+
	'0\tAspergillus terreus\tFluconazole\n'+
	'80\tAspergillus terreus\tItraconazole\n'+
	'90\tAspergillus terreus\tVoriconazole\n'+
	'0\tBacteroides fragilis\tAmikacin\n'+
	'90\tBacteroides fragilis\tAmoxicillin-Clavulanate\n'+
	'90\tBacteroides fragilis\tAmpicillin-Sulbactam\n'+
	'0\tBacteroides fragilis\tAmpicillin/Amoxicillin\n'+
	'90\tBacteroides fragilis\tAzithromycin\n'+
	'0\tBacteroides fragilis\tAztreonam\n'+
	'0\tBacteroides fragilis\tCefaclor/Loracarbef\n'+
	'0\tBacteroides fragilis\tCefazolin\n'+
	'0\tBacteroides fragilis\tCefepime\n'+
	'0\tBacteroides fragilis\tCefixime\n'+
	'0\tBacteroides fragilis\tCefotaxime\n'+
	'50\tBacteroides fragilis\tCefotetan\n'+
	'90\tBacteroides fragilis\tCefoxitin\n'+
	'0\tBacteroides fragilis\tCefprozil\n'+
	'0\tBacteroides fragilis\tCeftaroline\n'+
	'0\tBacteroides fragilis\tCeftazidime\n'+
	'0\tBacteroides fragilis\tCeftibuten\n'+
	'50\tBacteroides fragilis\tCeftizoxime\n'+
	'0\tBacteroides fragilis\tCeftobiprole\n'+
	'0\tBacteroides fragilis\tCeftriaxone\n'+
	'0\tBacteroides fragilis\tCefuroxime\n'+
	'0\tBacteroides fragilis\tCephalexin\n'+
	'90\tBacteroides fragilis\tChloramphenicol\n'+
	'0\tBacteroides fragilis\tCiprofloxacin\n'+
	'90\tBacteroides fragilis\tClarithromycin\n'+
	'90\tBacteroides fragilis\tClindamycin\n'+
	'0\tBacteroides fragilis\tCloxacillin/Dicloxacilin\n'+
	'90\tBacteroides fragilis\tDoripenem\n'+
	'90\tBacteroides fragilis\tDoxycycline\n'+
	'90\tBacteroides fragilis\tErtapenem\n'+
	'90\tBacteroides fragilis\tFusidic Acid\n'+
	'50\tBacteroides fragilis\tGatifloxacin\n'+
	'0\tBacteroides fragilis\tGentamicin\n'+
	'90\tBacteroides fragilis\tImipenem\n'+
	'0\tBacteroides fragilis\tLevofloxacin\n'+
	'90\tBacteroides fragilis\tMeropenem\n'+
	'0\tBacteroides fragilis\tMethicillin\n'+
	'90\tBacteroides fragilis\tMetronidazole\n'+
	'90\tBacteroides fragilis\tMinocycline\n'+
	'90\tBacteroides fragilis\tMoxifloxacin\n'+
	'0\tBacteroides fragilis\tNafcillin/Oxacillin\n'+
	'0\tBacteroides fragilis\tOfloxacin\n'+
	'0\tBacteroides fragilis\tPefloxacin\n'+
	'0\tBacteroides fragilis\tPenicillin G\n'+
	'50\tBacteroides fragilis\tPenicillin V\n'+
	'0\tBacteroides fragilis\tPiperacillin\n'+
	'90\tBacteroides fragilis\tPiperacillin-Tazobactam\n'+
	'90\tBacteroides fragilis\tQuinupristin-Dalfopristin\n'+
	'0\tBacteroides fragilis\tTelavancin\n'+
	'0\tBacteroides fragilis\tTicarcillin\n'+
	'90\tBacteroides fragilis\tTicarcillin-Clavulanate\n'+
	'90\tBacteroides fragilis\tTigecycline\n'+
	'0\tBacteroides fragilis\tTobramycin\n'+
	'0\tBacteroides fragilis\tVancomycin\n'+
	'90\tBlastomyces dermatitidis\tAmphotericin B\n'+
	'0\tBlastomyces dermatitidis\tCaspofungin\n'+
	'75\tBlastomyces dermatitidis\tFluconazole\n'+
	'90\tBlastomyces dermatitidis\tItraconazole\n'+
	'80\tBlastomyces dermatitidis\tVoriconazole\n'+
	'90\tBrucella\tAzithromycin\n'+
	'90\tBrucella\tClarithromycin\n'+
	'0\tBrucella\tDaptomycin (non-pneumonia)\n'+
	'90\tBrucella\tDoxycycline\n'+
	'90\tBrucella\tErythromycin\n'+
	'50\tBrucella\tFusidic Acid\n'+
	'0\tBrucella\tMetronidazole\n'+
	'90\tBrucella\tMinocycline\n'+
	'90\tBrucella\tTMP-SMX\n'+
	'90\tBrucella\tTelithromycin\n'+
	'90\tBrucella\tTigecycline\n'+
	'90\tBrucella\tTrimethoprim\n'+
	'0\tBurkholderia cepacia\tAmikacin\n'+
	'0\tBurkholderia cepacia\tAmoxicillin-Clavulanate\n'+
	'0\tBurkholderia cepacia\tAmpicillin-Sulbactam\n'+
	'0\tBurkholderia cepacia\tAmpicillin/Amoxicillin\n'+
	'0\tBurkholderia cepacia\tAzithromycin\n'+
	'0\tBurkholderia cepacia\tAztreonam\n'+
	'0\tBurkholderia cepacia\tCefaclor/Loracarbef\n'+
	'0\tBurkholderia cepacia\tCefadroxil\n'+
	'0\tBurkholderia cepacia\tCefazolin\n'+
	'50\tBurkholderia cepacia\tCefepime\n'+
	'0\tBurkholderia cepacia\tCefixime\n'+
	'50\tBurkholderia cepacia\tCefotaxime\n'+
	'0\tBurkholderia cepacia\tCefotetan\n'+
	'0\tBurkholderia cepacia\tCefoxitin\n'+
	'0\tBurkholderia cepacia\tCefprozil\n'+
	'0\tBurkholderia cepacia\tCeftaroline\n'+
	'90\tBurkholderia cepacia\tCeftazidime\n'+
	'90\tBurkholderia cepacia\tCeftibuten\n'+
	'50\tBurkholderia cepacia\tCeftizoxime\n'+
	'0\tBurkholderia cepacia\tCeftobiprole\n'+
	'50\tBurkholderia cepacia\tCeftriaxone\n'+
	'0\tBurkholderia cepacia\tCefuroxime\n'+
	'0\tBurkholderia cepacia\tCephalexin\n'+
	'90\tBurkholderia cepacia\tChloramphenicol\n'+
	'0\tBurkholderia cepacia\tCiprofloxacin\n'+
	'0\tBurkholderia cepacia\tClarithromycin\n'+
	'0\tBurkholderia cepacia\tClindamycin\n'+
	'0\tBurkholderia cepacia\tCloxacillin/Dicloxacilin\n'+
	'50\tBurkholderia cepacia\tColistimethate\n'+
	'0\tBurkholderia cepacia\tDaptomycin (non-pneumonia)\n'+
	'50\tBurkholderia cepacia\tDoripenem\n'+
	'0\tBurkholderia cepacia\tDoxycycline\n'+
	'0\tBurkholderia cepacia\tErtapenem\n'+
	'0\tBurkholderia cepacia\tErythromycin\n'+
	'0\tBurkholderia cepacia\tFusidic Acid\n'+
	'0\tBurkholderia cepacia\tGatifloxacin\n'+
	'0\tBurkholderia cepacia\tGentamicin\n'+
	'0\tBurkholderia cepacia\tImipenem\n'+
	'0\tBurkholderia cepacia\tLinezolid\n'+
	'90\tBurkholderia cepacia\tMeropenem\n'+
	'0\tBurkholderia cepacia\tMethicillin\n'+
	'0\tBurkholderia cepacia\tMetronidazole\n'+
	'0\tBurkholderia cepacia\tMinocycline\n'+
	'0\tBurkholderia cepacia\tMoxifloxacin\n'+
	'0\tBurkholderia cepacia\tNafcillin/Oxacillin\n'+
	'0\tBurkholderia cepacia\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tBurkholderia cepacia\tOfloxacin\n'+
	'0\tBurkholderia cepacia\tPenicillin G\n'+
	'0\tBurkholderia cepacia\tPenicillin V\n'+
	'90\tBurkholderia cepacia\tTMP-SMX\n'+
	'0\tBurkholderia cepacia\tTeicoplanin\n'+
	'0\tBurkholderia cepacia\tTelavancin\n'+
	'0\tBurkholderia cepacia\tTelithromycin\n'+
	'0\tBurkholderia cepacia\tTicarcillin\n'+
	'90\tBurkholderia cepacia\tTigecycline\n'+
	'0\tBurkholderia cepacia\tTobramycin\n'+
	'0\tBurkholderia cepacia\tTrimethoprim\n'+
	'0\tBurkholderia cepacia\tVancomycin\n'+
	'90\tCandida albicans\tAmphotericin B\n'+
	'90\tCandida albicans\tCaspofungin\n'+
	'90\tCandida albicans\tFluconazole\n'+
	'90\tCandida albicans\tItraconazole\n'+
	'90\tCandida albicans\tVoriconazole\n'+
	'80\tCandida glabrata\tAmphotericin B\n'+
	'90\tCandida glabrata\tCaspofungin\n'+
	'50\tCandida glabrata\tFluconazole\n'+
	'50\tCandida glabrata\tItraconazole\n'+
	'75\tCandida glabrata\tVoriconazole\n'+
	'80\tCandida krusei\tAmphotericin B\n'+
	'90\tCandida krusei\tCaspofungin\n'+
	'0\tCandida krusei\tFluconazole\n'+
	'75\tCandida krusei\tItraconazole\n'+
	'80\tCandida krusei\tVoriconazole\n'+
	'90\tCandida parapsilosis\tAmphotericin B\n'+
	'80\tCandida parapsilosis\tCaspofungin\n'+
	'90\tCandida parapsilosis\tFluconazole\n'+
	'90\tCandida parapsilosis\tItraconazole\n'+
	'90\tCandida parapsilosis\tVoriconazole\n'+
	'0\tChlamydophila\tAmikacin\n'+
	'0\tChlamydophila\tAmoxicillin-Clavulanate\n'+
	'0\tChlamydophila\tAmpicillin-Sulbactam\n'+
	'0\tChlamydophila\tAmpicillin/Amoxicillin\n'+
	'90\tChlamydophila\tAzithromycin\n'+
	'0\tChlamydophila\tAztreonam\n'+
	'90\tChlamydophila\tChloramphenicol\n'+
	'90\tChlamydophila\tCiprofloxacin\n'+
	'90\tChlamydophila\tClarithromycin\n'+
	'0\tChlamydophila\tClindamycin\n'+
	'0\tChlamydophila\tCloxacillin/Dicloxacilin\n'+
	'0\tChlamydophila\tDoripenem\n'+
	'90\tChlamydophila\tDoxycycline\n'+
	'0\tChlamydophila\tErtapenem\n'+
	'90\tChlamydophila\tErythromycin\n'+
	'0\tChlamydophila\tFusidic Acid\n'+
	'90\tChlamydophila\tGatifloxacin\n'+
	'90\tChlamydophila\tGemifloxacin\n'+
	'0\tChlamydophila\tGentamicin\n'+
	'0\tChlamydophila\tImipenem\n'+
	'90\tChlamydophila\tLevofloxacin\n'+
	'0\tChlamydophila\tLinezolid\n'+
	'0\tChlamydophila\tMeropenem\n'+
	'0\tChlamydophila\tMethicillin\n'+
	'0\tChlamydophila\tMetronidazole\n'+
	'90\tChlamydophila\tMinocycline\n'+
	'90\tChlamydophila\tMoxifloxacin\n'+
	'0\tChlamydophila\tNafcillin/Oxacillin\n'+
	'90\tChlamydophila\tOfloxacin\n'+
	'90\tChlamydophila\tPefloxacin\n'+
	'0\tChlamydophila\tPenicillin G\n'+
	'0\tChlamydophila\tPenicillin V\n'+
	'0\tChlamydophila\tPiperacillin\n'+
	'0\tChlamydophila\tPiperacillin-Tazobactam\n'+
	'90\tChlamydophila\tQuinupristin-Dalfopristin\n'+
	'90\tChlamydophila\tTelithromycin\n'+
	'0\tChlamydophila\tTicarcillin\n'+
	'0\tChlamydophila\tTicarcillin-Clavulanate\n'+
	'90\tChlamydophila\tTigecycline\n'+
	'0\tChlamydophila\tTobramycin\n'+
	'0\tCitrobacter\tAmoxicillin-Clavulanate\n'+
	'0\tCitrobacter\tAmpicillin-Sulbactam\n'+
	'0\tCitrobacter\tAmpicillin/Amoxicillin\n'+
	'90\tCitrobacter\tAztreonam\n'+
	'50\tCitrobacter\tCefaclor/Loracarbef\n'+
	'0\tCitrobacter\tCefazolin\n'+
	'90\tCitrobacter\tCefepime\n'+
	'90\tCitrobacter\tCefixime\n'+
	'90\tCitrobacter\tCefotaxime\n'+
	'50\tCitrobacter\tCefotetan\n'+
	'50\tCitrobacter\tCefoxitin\n'+
	'90\tCitrobacter\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tCitrobacter\tCefprozil\n'+
	'90\tCitrobacter\tCeftaroline\n'+
	'90\tCitrobacter\tCeftazidime\n'+
	'90\tCitrobacter\tCeftibuten\n'+
	'90\tCitrobacter\tCeftizoxime\n'+
	'90\tCitrobacter\tCeftobiprole\n'+
	'90\tCitrobacter\tCeftriaxone\n'+
	'50\tCitrobacter\tCefuroxime\n'+
	'0\tCitrobacter\tCephalexin\n'+
	'90\tCitrobacter\tCiprofloxacin\n'+
	'0\tCitrobacter\tCloxacillin/Dicloxacilin\n'+
	'90\tCitrobacter\tDoripenem\n'+
	'90\tCitrobacter\tErtapenem\n'+
	'90\tCitrobacter\tGatifloxacin\n'+
	'90\tCitrobacter\tImipenem\n'+
	'90\tCitrobacter\tLevofloxacin\n'+
	'90\tCitrobacter\tMeropenem\n'+
	'0\tCitrobacter\tMethicillin\n'+
	'90\tCitrobacter\tMoxifloxacin\n'+
	'0\tCitrobacter\tNafcillin/Oxacillin\n'+
	'90\tCitrobacter\tOfloxacin\n'+
	'90\tCitrobacter\tPefloxacin\n'+
	'0\tCitrobacter\tPenicillin G\n'+
	'0\tCitrobacter\tPenicillin V\n'+
	'90\tCitrobacter\tPiperacillin\n'+
	'90\tCitrobacter\tPiperacillin-Tazobactam\n'+
	'90\tCitrobacter\tTicarcillin\n'+
	'90\tCitrobacter\tTicarcillin-Clavulanate\n'+
	'0\tCitrobacter diversus\tCefaclor/Loracarbef\n'+
	'0\tCitrobacter diversus\tCefadroxil\n'+
	'0\tCitrobacter diversus\tCefazolin\n'+
	'90\tCitrobacter diversus\tCefepime\n'+
	'90\tCitrobacter diversus\tCefotaxime\n'+
	'50\tCitrobacter diversus\tCefotetan\n'+
	'50\tCitrobacter diversus\tCefoxitin\n'+
	'0\tCitrobacter diversus\tCefprozil\n'+
	'90\tCitrobacter diversus\tCeftaroline\n'+
	'90\tCitrobacter diversus\tCeftazidime\n'+
	'90\tCitrobacter diversus\tCeftibuten\n'+
	'90\tCitrobacter diversus\tCeftizoxime\n'+
	'90\tCitrobacter diversus\tCeftobiprole\n'+
	'90\tCitrobacter diversus\tCeftriaxone\n'+
	'50\tCitrobacter diversus\tCefuroxime\n'+
	'0\tCitrobacter diversus\tCephalexin\n'+
	'0\tCitrobacter freundii\tCefaclor/Loracarbef\n'+
	'0\tCitrobacter freundii\tCefadroxil\n'+
	'0\tCitrobacter freundii\tCefazolin\n'+
	'90\tCitrobacter freundii\tCefepime\n'+
	'0\tCitrobacter freundii\tCefixime\n'+
	'90\tCitrobacter freundii\tCefotaxime\n'+
	'0\tCitrobacter freundii\tCefotetan\n'+
	'0\tCitrobacter freundii\tCefoxitin\n'+
	'0\tCitrobacter freundii\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tCitrobacter freundii\tCefprozil\n'+
	'0\tCitrobacter freundii\tCeftazidime\n'+
	'0\tCitrobacter freundii\tCeftibuten\n'+
	'0\tCitrobacter freundii\tCeftizoxime\n'+
	'90\tCitrobacter freundii\tCeftriaxone\n'+
	'0\tCitrobacter freundii\tCefuroxime\n'+
	'0\tCitrobacter freundii\tCephalexin\n'+
	'0\tClostridium (not difficile)\tAmikacin\n'+
	'90\tClostridium (not difficile)\tAmoxicillin-Clavulanate\n'+
	'90\tClostridium (not difficile)\tAmpicillin-Sulbactam\n'+
	'90\tClostridium (not difficile)\tAmpicillin/Amoxicillin\n'+
	'90\tClostridium (not difficile)\tAzithromycin\n'+
	'0\tClostridium (not difficile)\tAztreonam\n'+
	'0\tClostridium (not difficile)\tCefixime\n'+
	'90\tClostridium (not difficile)\tCefotaxime\n'+
	'90\tClostridium (not difficile)\tCefotetan\n'+
	'90\tClostridium (not difficile)\tCefoxitin\n'+
	'90\tClostridium (not difficile)\tCefprozil\n'+
	'90\tClostridium (not difficile)\tCeftazidime\n'+
	'90\tClostridium (not difficile)\tCeftizoxime\n'+
	'90\tClostridium (not difficile)\tCeftobiprole\n'+
	'90\tClostridium (not difficile)\tCeftriaxone\n'+
	'90\tClostridium (not difficile)\tCefuroxime\n'+
	'90\tClostridium (not difficile)\tChloramphenicol\n'+
	'50\tClostridium (not difficile)\tCiprofloxacin\n'+
	'50\tClostridium (not difficile)\tClarithromycin\n'+
	'90\tClostridium (not difficile)\tClindamycin\n'+
	'90\tClostridium (not difficile)\tDoripenem\n'+
	'90\tClostridium (not difficile)\tDoxycycline\n'+
	'90\tClostridium (not difficile)\tErtapenem\n'+
	'50\tClostridium (not difficile)\tErythromycin\n'+
	'90\tClostridium (not difficile)\tFusidic Acid\n'+
	'90\tClostridium (not difficile)\tGatifloxacin\n'+
	'0\tClostridium (not difficile)\tGentamicin\n'+
	'90\tClostridium (not difficile)\tImipenem\n'+
	'90\tClostridium (not difficile)\tLevofloxacin\n'+
	'90\tClostridium (not difficile)\tLinezolid\n'+
	'90\tClostridium (not difficile)\tMeropenem\n'+
	'90\tClostridium (not difficile)\tMetronidazole\n'+
	'90\tClostridium (not difficile)\tMinocycline\n'+
	'90\tClostridium (not difficile)\tMoxifloxacin\n'+
	'50\tClostridium (not difficile)\tOfloxacin\n'+
	'90\tClostridium (not difficile)\tPenicillin G\n'+
	'90\tClostridium (not difficile)\tPenicillin V\n'+
	'90\tClostridium (not difficile)\tPiperacillin\n'+
	'90\tClostridium (not difficile)\tPiperacillin-Tazobactam\n'+
	'90\tClostridium (not difficile)\tTeicoplanin\n'+
	'90\tClostridium (not difficile)\tTelavancin\n'+
	'90\tClostridium (not difficile)\tTelithromycin\n'+
	'90\tClostridium (not difficile)\tTicarcillin\n'+
	'90\tClostridium (not difficile)\tTicarcillin-Clavulanate\n'+
	'90\tClostridium (not difficile)\tTigecycline\n'+
	'0\tClostridium (not difficile)\tTobramycin\n'+
	'90\tClostridium (not difficile)\tVancomycin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tAmpicillin-Sulbactam\n'+
	'90\tClostridium difficile (not Enterocolitis)\tAzithromycin\n'+
	'0\tClostridium difficile (not Enterocolitis)\tAztreonam\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCefepime\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCefotaxime\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCefoxitin\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCeftizoxime\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCeftobiprole\n'+
	'90\tClostridium difficile (not Enterocolitis)\tChloramphenicol\n'+
	'0\tClostridium difficile (not Enterocolitis)\tCiprofloxacin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tClarithromycin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tDoripenem\n'+
	'90\tClostridium difficile (not Enterocolitis)\tDoxycycline\n'+
	'90\tClostridium difficile (not Enterocolitis)\tErtapenem\n'+
	'50\tClostridium difficile (not Enterocolitis)\tErythromycin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tFusidic Acid\n'+
	'0\tClostridium difficile (not Enterocolitis)\tGatifloxacin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tImipenem\n'+
	'0\tClostridium difficile (not Enterocolitis)\tLevofloxacin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tLinezolid\n'+
	'90\tClostridium difficile (not Enterocolitis)\tMeropenem\n'+
	'90\tClostridium difficile (not Enterocolitis)\tMetronidazole\n'+
	'90\tClostridium difficile (not Enterocolitis)\tMinocycline\n'+
	'0\tClostridium difficile (not Enterocolitis)\tMoxifloxacin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tPenicillin G\n'+
	'90\tClostridium difficile (not Enterocolitis)\tPiperacillin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tQuinupristin-Dalfopristin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tTeicoplanin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tTelavancin\n'+
	'90\tClostridium difficile (not Enterocolitis)\tTigecycline\n'+
	'90\tClostridium difficile (not Enterocolitis)\tVancomycin\n'+
	'90\tCoccidioides immitis/posadasii\tAmphotericin B\n'+
	'0\tCoccidioides immitis/posadasii\tCaspofungin\n'+
	'90\tCoccidioides immitis/posadasii\tFluconazole\n'+
	'80\tCoccidioides immitis/posadasii\tItraconazole\n'+
	'80\tCoccidioides immitis/posadasii\tVoriconazole\n'+
	'90\tCorynebacterium jeikeium\tAmikacin\n'+
	'0\tCorynebacterium jeikeium\tAmoxicillin-Clavulanate\n'+
	'0\tCorynebacterium jeikeium\tAmpicillin-Sulbactam\n'+
	'0\tCorynebacterium jeikeium\tAmpicillin/Amoxicillin\n'+
	'90\tCorynebacterium jeikeium\tAzithromycin\n'+
	'0\tCorynebacterium jeikeium\tAztreonam\n'+
	'0\tCorynebacterium jeikeium\tCefaclor/Loracarbef\n'+
	'0\tCorynebacterium jeikeium\tCefadroxil\n'+
	'0\tCorynebacterium jeikeium\tCefazolin\n'+
	'0\tCorynebacterium jeikeium\tCefixime\n'+
	'0\tCorynebacterium jeikeium\tCefotaxime\n'+
	'0\tCorynebacterium jeikeium\tCefotetan\n'+
	'0\tCorynebacterium jeikeium\tCefoxitin\n'+
	'0\tCorynebacterium jeikeium\tCefprozil\n'+
	'0\tCorynebacterium jeikeium\tCeftazidime\n'+
	'0\tCorynebacterium jeikeium\tCeftibuten\n'+
	'0\tCorynebacterium jeikeium\tCeftizoxime\n'+
	'0\tCorynebacterium jeikeium\tCeftriaxone\n'+
	'0\tCorynebacterium jeikeium\tCefuroxime\n'+
	'0\tCorynebacterium jeikeium\tCephalexin\n'+
	'90\tCorynebacterium jeikeium\tChloramphenicol\n'+
	'0\tCorynebacterium jeikeium\tCiprofloxacin\n'+
	'90\tCorynebacterium jeikeium\tClarithromycin\n'+
	'0\tCorynebacterium jeikeium\tCloxacillin/Dicloxacilin\n'+
	'0\tCorynebacterium jeikeium\tColistimethate\n'+
	'50\tCorynebacterium jeikeium\tDaptomycin (non-pneumonia)\n'+
	'90\tCorynebacterium jeikeium\tDoxycycline\n'+
	'0\tCorynebacterium jeikeium\tErtapenem\n'+
	'90\tCorynebacterium jeikeium\tErythromycin\n'+
	'90\tCorynebacterium jeikeium\tGentamicin\n'+
	'0\tCorynebacterium jeikeium\tImipenem\n'+
	'90\tCorynebacterium jeikeium\tLinezolid\n'+
	'0\tCorynebacterium jeikeium\tMethicillin\n'+
	'0\tCorynebacterium jeikeium\tMetronidazole\n'+
	'90\tCorynebacterium jeikeium\tMinocycline\n'+
	'0\tCorynebacterium jeikeium\tNafcillin/Oxacillin\n'+
	'0\tCorynebacterium jeikeium\tOfloxacin\n'+
	'0\tCorynebacterium jeikeium\tPenicillin G\n'+
	'0\tCorynebacterium jeikeium\tPenicillin V\n'+
	'0\tCorynebacterium jeikeium\tPiperacillin\n'+
	'90\tCorynebacterium jeikeium\tQuinupristin-Dalfopristin\n'+
	'90\tCorynebacterium jeikeium\tRifampin (not for Staph monotherapy)\n'+
	'90\tCorynebacterium jeikeium\tTMP-SMX\n'+
	'90\tCorynebacterium jeikeium\tTeicoplanin\n'+
	'90\tCorynebacterium jeikeium\tTelavancin\n'+
	'90\tCorynebacterium jeikeium\tTelithromycin\n'+
	'0\tCorynebacterium jeikeium\tTicarcillin\n'+
	'0\tCorynebacterium jeikeium\tTicarcillin-Clavulanate\n'+
	'90\tCorynebacterium jeikeium\tTigecycline\n'+
	'90\tCorynebacterium jeikeium\tTobramycin\n'+
	'90\tCorynebacterium jeikeium\tTrimethoprim\n'+
	'90\tCorynebacterium jeikeium\tVancomycin\n'+
	'90\tCryptococcus neoformans\tAmphotericin B\n'+
	'0\tCryptococcus neoformans\tCaspofungin\n'+
	'90\tCryptococcus neoformans\tFluconazole\n'+
	'75\tCryptococcus neoformans\tItraconazole\n'+
	'90\tCryptococcus neoformans\tVoriconazole\n'+
	'75\tDematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)\tAmphotericin B\n'+
	'75\tDematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)\tCaspofungin\n'+
	'50\tDematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)\tFluconazole\n'+
	'80\tDematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)\tItraconazole\n'+
	'90\tDematiaceous molds (Alternaria, Bipolaris, Curvularia, Exophiala)\tVoriconazole\n'+
	'0\tEnterobacter\tAmoxicillin-Clavulanate\n'+
	'0\tEnterobacter\tAmpicillin-Sulbactam\n'+
	'0\tEnterobacter\tAmpicillin/Amoxicillin\n'+
	'50\tEnterobacter\tAzithromycin\n'+
	'90\tEnterobacter\tAztreonam\n'+
	'0\tEnterobacter\tCefaclor/Loracarbef\n'+
	'0\tEnterobacter\tCefadroxil\n'+
	'0\tEnterobacter\tCefazolin\n'+
	'90\tEnterobacter\tCefepime\n'+
	'0\tEnterobacter\tCefixime\n'+
	'90\tEnterobacter\tCefotaxime\n'+
	'50\tEnterobacter\tCefotetan\n'+
	'0\tEnterobacter\tCefoxitin\n'+
	'0\tEnterobacter\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tEnterobacter\tCefprozil\n'+
	'90\tEnterobacter\tCeftaroline\n'+
	'90\tEnterobacter\tCeftazidime\n'+
	'50\tEnterobacter\tCeftibuten\n'+
	'90\tEnterobacter\tCeftizoxime\n'+
	'90\tEnterobacter\tCeftobiprole\n'+
	'90\tEnterobacter\tCeftriaxone\n'+
	'0\tEnterobacter\tCefuroxime\n'+
	'0\tEnterobacter\tCephalexin\n'+
	'90\tEnterobacter\tChloramphenicol\n'+
	'90\tEnterobacter\tCiprofloxacin\n'+
	'0\tEnterobacter\tClarithromycin\n'+
	'0\tEnterobacter\tClindamycin\n'+
	'0\tEnterobacter\tCloxacillin/Dicloxacilin\n'+
	'0\tEnterobacter\tDaptomycin (non-pneumonia)\n'+
	'90\tEnterobacter\tDoripenem\n'+
	'50\tEnterobacter\tDoxycycline\n'+
	'90\tEnterobacter\tErtapenem\n'+
	'0\tEnterobacter\tErythromycin\n'+
	'0\tEnterobacter\tFusidic Acid\n'+
	'90\tEnterobacter\tGatifloxacin\n'+
	'90\tEnterobacter\tImipenem\n'+
	'90\tEnterobacter\tLevofloxacin\n'+
	'0\tEnterobacter\tLinezolid\n'+
	'90\tEnterobacter\tMeropenem\n'+
	'0\tEnterobacter\tMethicillin\n'+
	'0\tEnterobacter\tMetronidazole\n'+
	'50\tEnterobacter\tMinocycline\n'+
	'90\tEnterobacter\tMoxifloxacin\n'+
	'0\tEnterobacter\tNafcillin/Oxacillin\n'+
	'90\tEnterobacter\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tEnterobacter\tOfloxacin\n'+
	'90\tEnterobacter\tPefloxacin\n'+
	'0\tEnterobacter\tPenicillin G\n'+
	'0\tEnterobacter\tPenicillin V\n'+
	'90\tEnterobacter\tPiperacillin\n'+
	'90\tEnterobacter\tPiperacillin-Tazobactam\n'+
	'0\tEnterobacter\tQuinupristin-Dalfopristin\n'+
	'0\tEnterobacter\tRifampin (not for Staph monotherapy)\n'+
	'50\tEnterobacter\tTMP-SMX\n'+
	'0\tEnterobacter\tTeicoplanin\n'+
	'0\tEnterobacter\tTelavancin\n'+
	'0\tEnterobacter\tTelithromycin\n'+
	'90\tEnterobacter\tTicarcillin\n'+
	'90\tEnterobacter\tTicarcillin-Clavulanate\n'+
	'90\tEnterobacter\tTigecycline\n'+
	'50\tEnterobacter\tTrimethoprim\n'+
	'0\tEnterobacter\tVancomycin\n'+
	'0\tEnterococcus faecalis\tAmikacin\n'+
	'90\tEnterococcus faecalis\tAmoxicillin-Clavulanate\n'+
	'90\tEnterococcus faecalis\tAmpicillin-Sulbactam\n'+
	'90\tEnterococcus faecalis\tAmpicillin/Amoxicillin\n'+
	'0\tEnterococcus faecalis\tAzithromycin\n'+
	'0\tEnterococcus faecalis\tAztreonam\n'+
	'0\tEnterococcus faecalis\tCefaclor/Loracarbef\n'+
	'0\tEnterococcus faecalis\tCefadroxil\n'+
	'0\tEnterococcus faecalis\tCefazolin\n'+
	'0\tEnterococcus faecalis\tCefepime\n'+
	'0\tEnterococcus faecalis\tCefixime\n'+
	'0\tEnterococcus faecalis\tCefotaxime\n'+
	'0\tEnterococcus faecalis\tCefotetan\n'+
	'0\tEnterococcus faecalis\tCefoxitin\n'+
	'0\tEnterococcus faecalis\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tEnterococcus faecalis\tCefprozil\n'+
	'90\tEnterococcus faecalis\tCeftaroline\n'+
	'0\tEnterococcus faecalis\tCeftazidime\n'+
	'0\tEnterococcus faecalis\tCeftibuten\n'+
	'0\tEnterococcus faecalis\tCeftizoxime\n'+
	'90\tEnterococcus faecalis\tCeftobiprole\n'+
	'0\tEnterococcus faecalis\tCeftriaxone\n'+
	'0\tEnterococcus faecalis\tCefuroxime\n'+
	'0\tEnterococcus faecalis\tCephalexin\n'+
	'50\tEnterococcus faecalis\tChloramphenicol\n'+
	'50\tEnterococcus faecalis\tCiprofloxacin\n'+
	'0\tEnterococcus faecalis\tClarithromycin\n'+
	'0\tEnterococcus faecalis\tClindamycin\n'+
	'0\tEnterococcus faecalis\tCloxacillin/Dicloxacilin\n'+
	'0\tEnterococcus faecalis\tColistimethate\n'+
	'90\tEnterococcus faecalis\tDaptomycin (non-pneumonia)\n'+
	'50\tEnterococcus faecalis\tDoripenem\n'+
	'0\tEnterococcus faecalis\tDoxycycline\n'+
	'0\tEnterococcus faecalis\tErtapenem\n'+
	'0\tEnterococcus faecalis\tErythromycin\n'+
	'50\tEnterococcus faecalis\tFosfomycin\n'+
	'90\tEnterococcus faecalis\tGatifloxacin\n'+
	'90\tEnterococcus faecalis\tGemifloxacin\n'+
	'90\tEnterococcus faecalis\tGentamicin\n'+
	'90\tEnterococcus faecalis\tImipenem\n'+
	'90\tEnterococcus faecalis\tLevofloxacin\n'+
	'90\tEnterococcus faecalis\tLinezolid\n'+
	'50\tEnterococcus faecalis\tMeropenem\n'+
	'0\tEnterococcus faecalis\tMethicillin\n'+
	'0\tEnterococcus faecalis\tMetronidazole\n'+
	'0\tEnterococcus faecalis\tMinocycline\n'+
	'90\tEnterococcus faecalis\tMoxifloxacin\n'+
	'0\tEnterococcus faecalis\tNafcillin/Oxacillin\n'+
	'90\tEnterococcus faecalis\tNitrofurantoin (uncomplicated UTI)\n'+
	'50\tEnterococcus faecalis\tOfloxacin\n'+
	'0\tEnterococcus faecalis\tPefloxacin\n'+
	'90\tEnterococcus faecalis\tPenicillin G\n'+
	'90\tEnterococcus faecalis\tPenicillin V\n'+
	'90\tEnterococcus faecalis\tPiperacillin\n'+
	'90\tEnterococcus faecalis\tPiperacillin-Tazobactam\n'+
	'90\tEnterococcus faecalis\tQuinupristin-Dalfopristin\n'+
	'0\tEnterococcus faecalis\tRifampin (not for Staph monotherapy)\n'+
	'0\tEnterococcus faecalis\tTMP-SMX\n'+
	'50\tEnterococcus faecalis\tTeicoplanin\n'+
	'90\tEnterococcus faecalis\tTelavancin\n'+
	'0\tEnterococcus faecalis\tTelithromycin\n'+
	'50\tEnterococcus faecalis\tTicarcillin\n'+
	'50\tEnterococcus faecalis\tTicarcillin-Clavulanate\n'+
	'90\tEnterococcus faecalis\tTigecycline\n'+
	'0\tEnterococcus faecalis\tTobramycin\n'+
	'0\tEnterococcus faecalis\tTrimethoprim\n'+
	'50\tEnterococcus faecalis\tVancomycin\n'+
	'90\tEnterococcus faecium\tAmikacin\n'+
	'90\tEnterococcus faecium\tAmoxicillin-Clavulanate\n'+
	'90\tEnterococcus faecium\tAmpicillin-Sulbactam\n'+
	'90\tEnterococcus faecium\tAmpicillin/Amoxicillin\n'+
	'90\tEnterococcus faecium\tAzithromycin\n'+
	'0\tEnterococcus faecium\tAztreonam\n'+
	'50\tEnterococcus faecium\tChloramphenicol\n'+
	'0\tEnterococcus faecium\tCiprofloxacin\n'+
	'90\tEnterococcus faecium\tClarithromycin\n'+
	'90\tEnterococcus faecium\tClindamycin\n'+
	'0\tEnterococcus faecium\tCloxacillin/Dicloxacilin\n'+
	'0\tEnterococcus faecium\tColistimethate\n'+
	'90\tEnterococcus faecium\tDaptomycin (non-pneumonia)\n'+
	'0\tEnterococcus faecium\tDoripenem\n'+
	'50\tEnterococcus faecium\tDoxycycline\n'+
	'0\tEnterococcus faecium\tErtapenem\n'+
	'50\tEnterococcus faecium\tErythromycin\n'+
	'90\tEnterococcus faecium\tFusidic Acid\n'+
	'50\tEnterococcus faecium\tGatifloxacin\n'+
	'50\tEnterococcus faecium\tGemifloxacin\n'+
	'90\tEnterococcus faecium\tGentamicin\n'+
	'50\tEnterococcus faecium\tImipenem\n'+
	'0\tEnterococcus faecium\tLevofloxacin\n'+
	'90\tEnterococcus faecium\tLinezolid\n'+
	'0\tEnterococcus faecium\tMeropenem\n'+
	'0\tEnterococcus faecium\tMethicillin\n'+
	'0\tEnterococcus faecium\tMetronidazole\n'+
	'90\tEnterococcus faecium\tMinocycline\n'+
	'50\tEnterococcus faecium\tMoxifloxacin\n'+
	'0\tEnterococcus faecium\tNafcillin/Oxacillin\n'+
	'90\tEnterococcus faecium\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tEnterococcus faecium\tOfloxacin\n'+
	'0\tEnterococcus faecium\tPefloxacin\n'+
	'50\tEnterococcus faecium\tPenicillin G\n'+
	'50\tEnterococcus faecium\tPenicillin V\n'+
	'50\tEnterococcus faecium\tPiperacillin\n'+
	'50\tEnterococcus faecium\tPiperacillin-Tazobactam\n'+
	'90\tEnterococcus faecium\tQuinupristin-Dalfopristin\n'+
	'90\tEnterococcus faecium\tRifampin (not for Staph monotherapy)\n'+
	'90\tEnterococcus faecium\tTMP-SMX\n'+
	'90\tEnterococcus faecium\tTeicoplanin\n'+
	'90\tEnterococcus faecium\tTelavancin\n'+
	'90\tEnterococcus faecium\tTelithromycin\n'+
	'50\tEnterococcus faecium\tTicarcillin\n'+
	'50\tEnterococcus faecium\tTicarcillin-Clavulanate\n'+
	'90\tEnterococcus faecium\tTigecycline\n'+
	'90\tEnterococcus faecium\tTobramycin\n'+
	'50\tEnterococcus faecium\tTrimethoprim\n'+
	'90\tEnterococcus faecium\tVancomycin\n'+
	'90\tEscheria coli\tAmikacin\n'+
	'90\tEscheria coli\tAmoxicillin-Clavulanate\n'+
	'90\tEscheria coli\tAmpicillin-Sulbactam\n'+
	'50\tEscheria coli\tAmpicillin/Amoxicillin\n'+
	'0\tEscheria coli\tAzithromycin\n'+
	'90\tEscheria coli\tAztreonam\n'+
	'90\tEscheria coli\tCefaclor/Loracarbef\n'+
	'90\tEscheria coli\tCefadroxil\n'+
	'90\tEscheria coli\tCefazolin\n'+
	'90\tEscheria coli\tCefepime\n'+
	'90\tEscheria coli\tCefixime\n'+
	'90\tEscheria coli\tCefotaxime\n'+
	'90\tEscheria coli\tCefotetan\n'+
	'90\tEscheria coli\tCefoxitin\n'+
	'90\tEscheria coli\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tEscheria coli\tCefprozil\n'+
	'90\tEscheria coli\tCeftaroline\n'+
	'90\tEscheria coli\tCeftazidime\n'+
	'90\tEscheria coli\tCeftibuten\n'+
	'90\tEscheria coli\tCeftizoxime\n'+
	'90\tEscheria coli\tCeftobiprole\n'+
	'90\tEscheria coli\tCeftriaxone\n'+
	'90\tEscheria coli\tCefuroxime\n'+
	'90\tEscheria coli\tCephalexin\n'+
	'50\tEscheria coli\tChloramphenicol\n'+
	'90\tEscheria coli\tCiprofloxacin\n'+
	'0\tEscheria coli\tClarithromycin\n'+
	'0\tEscheria coli\tClindamycin\n'+
	'0\tEscheria coli\tCloxacillin/Dicloxacilin\n'+
	'90\tEscheria coli\tColistimethate\n'+
	'0\tEscheria coli\tDaptomycin (non-pneumonia)\n'+
	'90\tEscheria coli\tDoripenem\n'+
	'50\tEscheria coli\tDoxycycline\n'+
	'90\tEscheria coli\tErtapenem\n'+
	'0\tEscheria coli\tErythromycin\n'+
	'50\tEscheria coli\tFosfomycin\n'+
	'0\tEscheria coli\tFusidic Acid\n'+
	'90\tEscheria coli\tGatifloxacin\n'+
	'90\tEscheria coli\tGemifloxacin\n'+
	'90\tEscheria coli\tGentamicin\n'+
	'90\tEscheria coli\tImipenem\n'+
	'90\tEscheria coli\tLevofloxacin\n'+
	'0\tEscheria coli\tLinezolid\n'+
	'90\tEscheria coli\tMeropenem\n'+
	'0\tEscheria coli\tMethicillin\n'+
	'0\tEscheria coli\tMetronidazole\n'+
	'50\tEscheria coli\tMinocycline\n'+
	'90\tEscheria coli\tMoxifloxacin\n'+
	'0\tEscheria coli\tNafcillin/Oxacillin\n'+
	'50\tEscheria coli\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tEscheria coli\tOfloxacin\n'+
	'90\tEscheria coli\tPefloxacin\n'+
	'0\tEscheria coli\tPenicillin G\n'+
	'0\tEscheria coli\tPenicillin V\n'+
	'90\tEscheria coli\tPiperacillin\n'+
	'90\tEscheria coli\tPiperacillin-Tazobactam\n'+
	'0\tEscheria coli\tQuinupristin-Dalfopristin\n'+
	'0\tEscheria coli\tRifampin (not for Staph monotherapy)\n'+
	'50\tEscheria coli\tTMP-SMX\n'+
	'0\tEscheria coli\tTeicoplanin\n'+
	'0\tEscheria coli\tTelavancin\n'+
	'0\tEscheria coli\tTelithromycin\n'+
	'50\tEscheria coli\tTicarcillin\n'+
	'90\tEscheria coli\tTicarcillin-Clavulanate\n'+
	'90\tEscheria coli\tTigecycline\n'+
	'90\tEscheria coli\tTobramycin\n'+
	'50\tEscheria coli\tTrimethoprim\n'+
	'0\tEscheria coli\tVancomycin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tAmoxicillin-Clavulanate\n'+
	'0\tEscheria coli/Klebsiella ESBL\tAmpicillin-Sulbactam\n'+
	'0\tEscheria coli/Klebsiella ESBL\tAmpicillin/Amoxicillin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tAztreonam\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefaclor/Loracarbef\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefadroxil\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefazolin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefepime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefixime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefotaxime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefotetan\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefoxitin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefprozil\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftaroline\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftazidime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftibuten\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftizoxime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftobiprole\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCeftriaxone\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCefuroxime\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCephalexin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tCiprofloxacin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tCloxacillin/Dicloxacilin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tColistimethate\n'+
	'0\tEscheria coli/Klebsiella ESBL\tDaptomycin (non-pneumonia)\n'+
	'90\tEscheria coli/Klebsiella ESBL\tDoripenem\n'+
	'90\tEscheria coli/Klebsiella ESBL\tErtapenem\n'+
	'0\tEscheria coli/Klebsiella ESBL\tFusidic Acid\n'+
	'90\tEscheria coli/Klebsiella ESBL\tGatifloxacin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tGemifloxacin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tImipenem\n'+
	'90\tEscheria coli/Klebsiella ESBL\tLevofloxacin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tLinezolid\n'+
	'90\tEscheria coli/Klebsiella ESBL\tMeropenem\n'+
	'0\tEscheria coli/Klebsiella ESBL\tMethicillin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tMoxifloxacin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tNafcillin/Oxacillin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tOfloxacin\n'+
	'90\tEscheria coli/Klebsiella ESBL\tPefloxacin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tPenicillin G\n'+
	'0\tEscheria coli/Klebsiella ESBL\tPenicillin V\n'+
	'0\tEscheria coli/Klebsiella ESBL\tPiperacillin\n'+
	'50\tEscheria coli/Klebsiella ESBL\tPiperacillin-Tazobactam\n'+
	'0\tEscheria coli/Klebsiella ESBL\tQuinupristin-Dalfopristin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tTeicoplanin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tTelavancin\n'+
	'0\tEscheria coli/Klebsiella ESBL\tTicarcillin\n'+
	'50\tEscheria coli/Klebsiella ESBL\tTicarcillin-Clavulanate\n'+
	'0\tEscheria coli/Klebsiella ESBL\tVancomycin\n'+
	'90\tEscheria coli/Klebsiella KPC\tAmikacin\n'+
	'0\tEscheria coli/Klebsiella KPC\tAmoxicillin-Clavulanate\n'+
	'0\tEscheria coli/Klebsiella KPC\tAmpicillin-Sulbactam\n'+
	'0\tEscheria coli/Klebsiella KPC\tAmpicillin/Amoxicillin\n'+
	'0\tEscheria coli/Klebsiella KPC\tAzithromycin\n'+
	'0\tEscheria coli/Klebsiella KPC\tAztreonam\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefaclor/Loracarbef\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefadroxil\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefazolin\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefepime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefixime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefotaxime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefotetan\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefoxitin\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefprozil\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftaroline\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftazidime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftibuten\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftizoxime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftobiprole\n'+
	'0\tEscheria coli/Klebsiella KPC\tCeftriaxone\n'+
	'0\tEscheria coli/Klebsiella KPC\tCefuroxime\n'+
	'0\tEscheria coli/Klebsiella KPC\tCephalexin\n'+
	'0\tEscheria coli/Klebsiella KPC\tChloramphenicol\n'+
	'0\tEscheria coli/Klebsiella KPC\tClarithromycin\n'+
	'0\tEscheria coli/Klebsiella KPC\tClindamycin\n'+
	'0\tEscheria coli/Klebsiella KPC\tCloxacillin/Dicloxacilin\n'+
	'90\tEscheria coli/Klebsiella KPC\tColistimethate\n'+
	'0\tEscheria coli/Klebsiella KPC\tDaptomycin (non-pneumonia)\n'+
	'0\tEscheria coli/Klebsiella KPC\tDoripenem\n'+
	'0\tEscheria coli/Klebsiella KPC\tDoxycycline\n'+
	'0\tEscheria coli/Klebsiella KPC\tErtapenem\n'+
	'0\tEscheria coli/Klebsiella KPC\tErythromycin\n'+
	'50\tEscheria coli/Klebsiella KPC\tFosfomycin\n'+
	'0\tEscheria coli/Klebsiella KPC\tFusidic Acid\n'+
	'90\tEscheria coli/Klebsiella KPC\tGentamicin\n'+
	'50\tEscheria coli/Klebsiella KPC\tImipenem\n'+
	'0\tEscheria coli/Klebsiella KPC\tLinezolid\n'+
	'50\tEscheria coli/Klebsiella KPC\tMeropenem\n'+
	'0\tEscheria coli/Klebsiella KPC\tMethicillin\n'+
	'0\tEscheria coli/Klebsiella KPC\tMetronidazole\n'+
	'0\tEscheria coli/Klebsiella KPC\tMinocycline\n'+
	'0\tEscheria coli/Klebsiella KPC\tNafcillin/Oxacillin\n'+
	'50\tEscheria coli/Klebsiella KPC\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tEscheria coli/Klebsiella KPC\tPenicillin G\n'+
	'0\tEscheria coli/Klebsiella KPC\tPenicillin V\n'+
	'0\tEscheria coli/Klebsiella KPC\tPiperacillin\n'+
	'0\tEscheria coli/Klebsiella KPC\tPiperacillin-Tazobactam\n'+
	'0\tEscheria coli/Klebsiella KPC\tQuinupristin-Dalfopristin\n'+
	'0\tEscheria coli/Klebsiella KPC\tRifampin (not for Staph monotherapy)\n'+
	'0\tEscheria coli/Klebsiella KPC\tTeicoplanin\n'+
	'0\tEscheria coli/Klebsiella KPC\tTelavancin\n'+
	'0\tEscheria coli/Klebsiella KPC\tTelithromycin\n'+
	'0\tEscheria coli/Klebsiella KPC\tTicarcillin\n'+
	'0\tEscheria coli/Klebsiella KPC\tTicarcillin-Clavulanate\n'+
	'90\tEscheria coli/Klebsiella KPC\tTigecycline\n'+
	'90\tEscheria coli/Klebsiella KPC\tTobramycin\n'+
	'50\tEscheria coli/Klebsiella KPC\tTrimethoprim\n'+
	'0\tEscheria coli/Klebsiella KPC\tVancomycin\n'+
	'0\tFranciscella tularensis\tAzithromycin\n'+
	'90\tFranciscella tularensis\tChloramphenicol\n'+
	'0\tFranciscella tularensis\tClarithromycin\n'+
	'0\tFranciscella tularensis\tClindamycin\n'+
	'0\tFranciscella tularensis\tDaptomycin (non-pneumonia)\n'+
	'90\tFranciscella tularensis\tDoxycycline\n'+
	'0\tFranciscella tularensis\tErythromycin\n'+
	'90\tFranciscella tularensis\tGentamicin\n'+
	'0\tFranciscella tularensis\tLinezolid\n'+
	'0\tFranciscella tularensis\tMetronidazole\n'+
	'90\tFranciscella tularensis\tMinocycline\n'+
	'90\tFranciscella tularensis\tRifampin (not for Staph monotherapy)\n'+
	'90\tFranciscella tularensis\tTMP-SMX\n'+
	'0\tFranciscella tularensis\tTeicoplanin\n'+
	'0\tFranciscella tularensis\tTelavancin\n'+
	'0\tFranciscella tularensis\tTelithromycin\n'+
	'90\tFranciscella tularensis\tTrimethoprim\n'+
	'0\tFranciscella tularensis\tVancomycin\n'+
	'80\tFusarium\tAmphotericin B\n'+
	'0\tFusarium\tCaspofungin\n'+
	'0\tFusarium\tFluconazole\n'+
	'50\tFusarium\tItraconazole\n'+
	'80\tFusarium\tVoriconazole\n'+
	'50\tHaemophilus ducreyi\tAmikacin\n'+
	'90\tHaemophilus ducreyi\tAmoxicillin-Clavulanate\n'+
	'90\tHaemophilus ducreyi\tAmpicillin-Sulbactam\n'+
	'0\tHaemophilus ducreyi\tAmpicillin/Amoxicillin\n'+
	'90\tHaemophilus ducreyi\tCefixime\n'+
	'90\tHaemophilus ducreyi\tCefotaxime\n'+
	'90\tHaemophilus ducreyi\tCefoxitin\n'+
	'90\tHaemophilus ducreyi\tCeftazidime\n'+
	'90\tHaemophilus ducreyi\tCeftizoxime\n'+
	'90\tHaemophilus ducreyi\tCeftriaxone\n'+
	'90\tHaemophilus ducreyi\tChloramphenicol\n'+
	'0\tHaemophilus ducreyi\tDaptomycin (non-pneumonia)\n'+
	'90\tHaemophilus ducreyi\tDoxycycline\n'+
	'0\tHaemophilus ducreyi\tFusidic Acid\n'+
	'50\tHaemophilus ducreyi\tGentamicin\n'+
	'0\tHaemophilus ducreyi\tMetronidazole\n'+
	'90\tHaemophilus ducreyi\tMinocycline\n'+
	'90\tHaemophilus ducreyi\tPenicillin G\n'+
	'50\tHaemophilus ducreyi\tTobramycin\n'+
	'90\tHaemophilus influenzae\tAmoxicillin-Clavulanate\n'+
	'90\tHaemophilus influenzae\tAmpicillin-Sulbactam\n'+
	'50\tHaemophilus influenzae\tAmpicillin/Amoxicillin\n'+
	'90\tHaemophilus influenzae\tAztreonam\n'+
	'90\tHaemophilus influenzae\tCefaclor/Loracarbef\n'+
	'90\tHaemophilus influenzae\tCefazolin\n'+
	'90\tHaemophilus influenzae\tCefepime\n'+
	'90\tHaemophilus influenzae\tCefixime\n'+
	'90\tHaemophilus influenzae\tCefotaxime\n'+
	'90\tHaemophilus influenzae\tCefotetan\n'+
	'90\tHaemophilus influenzae\tCefoxitin\n'+
	'90\tHaemophilus influenzae\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tHaemophilus influenzae\tCefprozil\n'+
	'90\tHaemophilus influenzae\tCeftaroline\n'+
	'90\tHaemophilus influenzae\tCeftazidime\n'+
	'90\tHaemophilus influenzae\tCeftibuten\n'+
	'90\tHaemophilus influenzae\tCeftizoxime\n'+
	'90\tHaemophilus influenzae\tCeftobiprole\n'+
	'90\tHaemophilus influenzae\tCeftriaxone\n'+
	'90\tHaemophilus influenzae\tCefuroxime\n'+
	'0\tHaemophilus influenzae\tCephalexin\n'+
	'90\tHaemophilus influenzae\tChloramphenicol\n'+
	'90\tHaemophilus influenzae\tCiprofloxacin\n'+
	'0\tHaemophilus influenzae\tCloxacillin/Dicloxacilin\n'+
	'0\tHaemophilus influenzae\tDaptomycin (non-pneumonia)\n'+
	'90\tHaemophilus influenzae\tDoripenem\n'+
	'90\tHaemophilus influenzae\tDoxycycline\n'+
	'90\tHaemophilus influenzae\tErtapenem\n'+
	'90\tHaemophilus influenzae\tGatifloxacin\n'+
	'90\tHaemophilus influenzae\tGemifloxacin\n'+
	'0\tHaemophilus influenzae\tGentamicin\n'+
	'90\tHaemophilus influenzae\tImipenem\n'+
	'90\tHaemophilus influenzae\tLevofloxacin\n'+
	'90\tHaemophilus influenzae\tMeropenem\n'+
	'0\tHaemophilus influenzae\tMethicillin\n'+
	'0\tHaemophilus influenzae\tMetronidazole\n'+
	'90\tHaemophilus influenzae\tMinocycline\n'+
	'90\tHaemophilus influenzae\tMoxifloxacin\n'+
	'0\tHaemophilus influenzae\tNafcillin/Oxacillin\n'+
	'90\tHaemophilus influenzae\tOfloxacin\n'+
	'90\tHaemophilus influenzae\tPefloxacin\n'+
	'0\tHaemophilus influenzae\tPenicillin G\n'+
	'0\tHaemophilus influenzae\tPenicillin V\n'+
	'50\tHaemophilus influenzae\tPiperacillin\n'+
	'90\tHaemophilus influenzae\tPiperacillin-Tazobactam\n'+
	'0\tHaemophilus influenzae\tRifampin (not for Staph monotherapy)\n'+
	'90\tHaemophilus influenzae\tTMP-SMX\n'+
	'0\tHaemophilus influenzae\tTeicoplanin\n'+
	'0\tHaemophilus influenzae\tTelavancin\n'+
	'50\tHaemophilus influenzae\tTicarcillin\n'+
	'90\tHaemophilus influenzae\tTicarcillin-Clavulanate\n'+
	'90\tHaemophilus influenzae\tTigecycline\n'+
	'0\tHaemophilus influenzae\tVancomycin\n'+
	'90\tHistoplasma capsulatum\tAmphotericin B\n'+
	'0\tHistoplasma capsulatum\tCaspofungin\n'+
	'75\tHistoplasma capsulatum\tFluconazole\n'+
	'90\tHistoplasma capsulatum\tItraconazole\n'+
	'80\tHistoplasma capsulatum\tVoriconazole\n'+
	'90\tKlebsiella\tAmikacin\n'+
	'90\tKlebsiella\tAmoxicillin-Clavulanate\n'+
	'90\tKlebsiella\tAmpicillin-Sulbactam\n'+
	'0\tKlebsiella\tAmpicillin/Amoxicillin\n'+
	'0\tKlebsiella\tAzithromycin\n'+
	'90\tKlebsiella\tAztreonam\n'+
	'90\tKlebsiella\tCefaclor/Loracarbef\n'+
	'90\tKlebsiella\tCefadroxil\n'+
	'90\tKlebsiella\tCefazolin\n'+
	'90\tKlebsiella\tCefepime\n'+
	'90\tKlebsiella\tCefixime\n'+
	'90\tKlebsiella\tCefotaxime\n'+
	'90\tKlebsiella\tCefotetan\n'+
	'90\tKlebsiella\tCefoxitin\n'+
	'90\tKlebsiella\tCefprozil\n'+
	'90\tKlebsiella\tCeftaroline\n'+
	'90\tKlebsiella\tCeftazidime\n'+
	'90\tKlebsiella\tCeftibuten\n'+
	'90\tKlebsiella\tCeftizoxime\n'+
	'90\tKlebsiella\tCeftobiprole\n'+
	'90\tKlebsiella\tCeftriaxone\n'+
	'90\tKlebsiella\tCefuroxime\n'+
	'90\tKlebsiella\tCephalexin\n'+
	'50\tKlebsiella\tChloramphenicol\n'+
	'90\tKlebsiella\tCiprofloxacin\n'+
	'0\tKlebsiella\tClarithromycin\n'+
	'0\tKlebsiella\tClindamycin\n'+
	'0\tKlebsiella\tCloxacillin/Dicloxacilin\n'+
	'90\tKlebsiella\tColistimethate\n'+
	'0\tKlebsiella\tDaptomycin (non-pneumonia)\n'+
	'90\tKlebsiella\tDoripenem\n'+
	'50\tKlebsiella\tDoxycycline\n'+
	'90\tKlebsiella\tErtapenem\n'+
	'0\tKlebsiella\tErythromycin\n'+
	'0\tKlebsiella\tFusidic Acid\n'+
	'90\tKlebsiella\tGatifloxacin\n'+
	'90\tKlebsiella\tGemifloxacin\n'+
	'90\tKlebsiella\tGentamicin\n'+
	'90\tKlebsiella\tImipenem\n'+
	'90\tKlebsiella\tLevofloxacin\n'+
	'0\tKlebsiella\tLinezolid\n'+
	'90\tKlebsiella\tMeropenem\n'+
	'0\tKlebsiella\tMethicillin\n'+
	'0\tKlebsiella\tMetronidazole\n'+
	'50\tKlebsiella\tMinocycline\n'+
	'90\tKlebsiella\tMoxifloxacin\n'+
	'0\tKlebsiella\tNafcillin/Oxacillin\n'+
	'90\tKlebsiella\tOfloxacin\n'+
	'90\tKlebsiella\tPefloxacin\n'+
	'0\tKlebsiella\tPenicillin G\n'+
	'0\tKlebsiella\tPenicillin V\n'+
	'90\tKlebsiella\tPiperacillin\n'+
	'90\tKlebsiella\tPiperacillin-Tazobactam\n'+
	'0\tKlebsiella\tQuinupristin-Dalfopristin\n'+
	'0\tKlebsiella\tRifampin (not for Staph monotherapy)\n'+
	'50\tKlebsiella\tTMP-SMX\n'+
	'0\tKlebsiella\tTeicoplanin\n'+
	'0\tKlebsiella\tTelavancin\n'+
	'0\tKlebsiella\tTelithromycin\n'+
	'0\tKlebsiella\tTicarcillin\n'+
	'90\tKlebsiella\tTicarcillin-Clavulanate\n'+
	'90\tKlebsiella\tTigecycline\n'+
	'90\tKlebsiella\tTobramycin\n'+
	'50\tKlebsiella\tTrimethoprim\n'+
	'0\tKlebsiella\tVancomycin\n'+
	'0\tLegionella\tAmoxicillin-Clavulanate\n'+
	'0\tLegionella\tAmpicillin-Sulbactam\n'+
	'0\tLegionella\tAmpicillin/Amoxicillin\n'+
	'90\tLegionella\tAzithromycin\n'+
	'0\tLegionella\tAztreonam\n'+
	'0\tLegionella\tCefaclor/Loracarbef\n'+
	'0\tLegionella\tCefadroxil\n'+
	'0\tLegionella\tCefazolin\n'+
	'0\tLegionella\tCefepime\n'+
	'0\tLegionella\tCefixime\n'+
	'0\tLegionella\tCefotaxime\n'+
	'0\tLegionella\tCefotetan\n'+
	'0\tLegionella\tCefoxitin\n'+
	'0\tLegionella\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tLegionella\tCefprozil\n'+
	'0\tLegionella\tCeftaroline\n'+
	'0\tLegionella\tCeftazidime\n'+
	'0\tLegionella\tCeftibuten\n'+
	'0\tLegionella\tCeftizoxime\n'+
	'0\tLegionella\tCeftobiprole\n'+
	'0\tLegionella\tCeftriaxone\n'+
	'0\tLegionella\tCefuroxime\n'+
	'0\tLegionella\tCephalexin\n'+
	'90\tLegionella\tChloramphenicol\n'+
	'90\tLegionella\tCiprofloxacin\n'+
	'90\tLegionella\tClindamycin\n'+
	'0\tLegionella\tCloxacillin/Dicloxacilin\n'+
	'0\tLegionella\tDaptomycin (non-pneumonia)\n'+
	'0\tLegionella\tDoripenem\n'+
	'0\tLegionella\tErtapenem\n'+
	'90\tLegionella\tErythromycin\n'+
	'90\tLegionella\tGatifloxacin\n'+
	'90\tLegionella\tGemifloxacin\n'+
	'0\tLegionella\tImipenem\n'+
	'90\tLegionella\tLevofloxacin\n'+
	'0\tLegionella\tMeropenem\n'+
	'0\tLegionella\tMethicillin\n'+
	'0\tLegionella\tMetronidazole\n'+
	'90\tLegionella\tMoxifloxacin\n'+
	'0\tLegionella\tNafcillin/Oxacillin\n'+
	'90\tLegionella\tOfloxacin\n'+
	'90\tLegionella\tPefloxacin\n'+
	'0\tLegionella\tPenicillin G\n'+
	'0\tLegionella\tPenicillin V\n'+
	'0\tLegionella\tPiperacillin\n'+
	'0\tLegionella\tPiperacillin-Tazobactam\n'+
	'50\tLegionella\tTMP-SMX\n'+
	'0\tLegionella\tTicarcillin\n'+
	'0\tLegionella\tTicarcillin-Clavulanate\n'+
	'0\tLegionella\tVancomycin\n'+
	'0\tListeria monocytogenes\tAmikacin\n'+
	'90\tListeria monocytogenes\tAmpicillin-Sulbactam\n'+
	'90\tListeria monocytogenes\tAmpicillin/Amoxicillin\n'+
	'50\tListeria monocytogenes\tAzithromycin\n'+
	'0\tListeria monocytogenes\tAztreonam\n'+
	'0\tListeria monocytogenes\tCefaclor/Loracarbef\n'+
	'0\tListeria monocytogenes\tCefadroxil\n'+
	'0\tListeria monocytogenes\tCefazolin\n'+
	'0\tListeria monocytogenes\tCefepime\n'+
	'0\tListeria monocytogenes\tCefixime\n'+
	'0\tListeria monocytogenes\tCefotaxime\n'+
	'0\tListeria monocytogenes\tCefotetan\n'+
	'0\tListeria monocytogenes\tCefoxitin\n'+
	'0\tListeria monocytogenes\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tListeria monocytogenes\tCefprozil\n'+
	'0\tListeria monocytogenes\tCeftazidime\n'+
	'0\tListeria monocytogenes\tCeftibuten\n'+
	'0\tListeria monocytogenes\tCeftizoxime\n'+
	'0\tListeria monocytogenes\tCeftriaxone\n'+
	'0\tListeria monocytogenes\tCefuroxime\n'+
	'0\tListeria monocytogenes\tCephalexin\n'+
	'90\tListeria monocytogenes\tChloramphenicol\n'+
	'90\tListeria monocytogenes\tCiprofloxacin\n'+
	'50\tListeria monocytogenes\tClarithromycin\n'+
	'0\tListeria monocytogenes\tClindamycin\n'+
	'0\tListeria monocytogenes\tCloxacillin/Dicloxacilin\n'+
	'0\tListeria monocytogenes\tColistimethate\n'+
	'0\tListeria monocytogenes\tDaptomycin (non-pneumonia)\n'+
	'90\tListeria monocytogenes\tDoripenem\n'+
	'50\tListeria monocytogenes\tDoxycycline\n'+
	'50\tListeria monocytogenes\tErtapenem\n'+
	'50\tListeria monocytogenes\tErythromycin\n'+
	'90\tListeria monocytogenes\tFosfomycin\n'+
	'90\tListeria monocytogenes\tFusidic Acid\n'+
	'90\tListeria monocytogenes\tGatifloxacin\n'+
	'90\tListeria monocytogenes\tGemifloxacin\n'+
	'0\tListeria monocytogenes\tGentamicin\n'+
	'90\tListeria monocytogenes\tImipenem\n'+
	'90\tListeria monocytogenes\tLevofloxacin\n'+
	'90\tListeria monocytogenes\tMeropenem\n'+
	'0\tListeria monocytogenes\tMethicillin\n'+
	'0\tListeria monocytogenes\tMetronidazole\n'+
	'50\tListeria monocytogenes\tMinocycline\n'+
	'90\tListeria monocytogenes\tMoxifloxacin\n'+
	'0\tListeria monocytogenes\tNafcillin/Oxacillin\n'+
	'90\tListeria monocytogenes\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tListeria monocytogenes\tOfloxacin\n'+
	'0\tListeria monocytogenes\tPefloxacin\n'+
	'90\tListeria monocytogenes\tPenicillin G\n'+
	'0\tListeria monocytogenes\tPenicillin V\n'+
	'90\tListeria monocytogenes\tPiperacillin\n'+
	'90\tListeria monocytogenes\tQuinupristin-Dalfopristin\n'+
	'90\tListeria monocytogenes\tRifampin (not for Staph monotherapy)\n'+
	'50\tListeria monocytogenes\tTMP-SMX\n'+
	'0\tListeria monocytogenes\tTeicoplanin\n'+
	'0\tListeria monocytogenes\tTelavancin\n'+
	'90\tListeria monocytogenes\tTelithromycin\n'+
	'90\tListeria monocytogenes\tTicarcillin\n'+
	'90\tListeria monocytogenes\tTigecycline\n'+
	'0\tListeria monocytogenes\tTobramycin\n'+
	'0\tListeria monocytogenes\tTrimethoprim\n'+
	'0\tListeria monocytogenes\tVancomycin\n'+
	'90\tMoraxella catarrhalis\tAmikacin\n'+
	'90\tMoraxella catarrhalis\tAmoxicillin-Clavulanate\n'+
	'90\tMoraxella catarrhalis\tAmpicillin-Sulbactam\n'+
	'0\tMoraxella catarrhalis\tAmpicillin/Amoxicillin\n'+
	'90\tMoraxella catarrhalis\tAzithromycin\n'+
	'90\tMoraxella catarrhalis\tAztreonam\n'+
	'50\tMoraxella catarrhalis\tCefaclor/Loracarbef\n'+
	'0\tMoraxella catarrhalis\tCefadroxil\n'+
	'50\tMoraxella catarrhalis\tCefazolin\n'+
	'90\tMoraxella catarrhalis\tCefepime\n'+
	'90\tMoraxella catarrhalis\tCefixime\n'+
	'90\tMoraxella catarrhalis\tCefotaxime\n'+
	'90\tMoraxella catarrhalis\tCefotetan\n'+
	'90\tMoraxella catarrhalis\tCefoxitin\n'+
	'90\tMoraxella catarrhalis\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tMoraxella catarrhalis\tCefprozil\n'+
	'90\tMoraxella catarrhalis\tCeftaroline\n'+
	'90\tMoraxella catarrhalis\tCeftazidime\n'+
	'90\tMoraxella catarrhalis\tCeftibuten\n'+
	'90\tMoraxella catarrhalis\tCeftizoxime\n'+
	'90\tMoraxella catarrhalis\tCeftobiprole\n'+
	'90\tMoraxella catarrhalis\tCeftriaxone\n'+
	'90\tMoraxella catarrhalis\tCefuroxime\n'+
	'0\tMoraxella catarrhalis\tCephalexin\n'+
	'90\tMoraxella catarrhalis\tChloramphenicol\n'+
	'90\tMoraxella catarrhalis\tCiprofloxacin\n'+
	'90\tMoraxella catarrhalis\tClarithromycin\n'+
	'0\tMoraxella catarrhalis\tClindamycin\n'+
	'0\tMoraxella catarrhalis\tCloxacillin/Dicloxacilin\n'+
	'0\tMoraxella catarrhalis\tDaptomycin (non-pneumonia)\n'+
	'90\tMoraxella catarrhalis\tDoripenem\n'+
	'90\tMoraxella catarrhalis\tDoxycycline\n'+
	'90\tMoraxella catarrhalis\tErtapenem\n'+
	'50\tMoraxella catarrhalis\tErythromycin\n'+
	'90\tMoraxella catarrhalis\tGatifloxacin\n'+
	'90\tMoraxella catarrhalis\tGemifloxacin\n'+
	'90\tMoraxella catarrhalis\tGentamicin\n'+
	'90\tMoraxella catarrhalis\tImipenem\n'+
	'90\tMoraxella catarrhalis\tLevofloxacin\n'+
	'50\tMoraxella catarrhalis\tLinezolid\n'+
	'90\tMoraxella catarrhalis\tMeropenem\n'+
	'0\tMoraxella catarrhalis\tMethicillin\n'+
	'0\tMoraxella catarrhalis\tMetronidazole\n'+
	'90\tMoraxella catarrhalis\tMinocycline\n'+
	'90\tMoraxella catarrhalis\tMoxifloxacin\n'+
	'0\tMoraxella catarrhalis\tNafcillin/Oxacillin\n'+
	'90\tMoraxella catarrhalis\tOfloxacin\n'+
	'90\tMoraxella catarrhalis\tPefloxacin\n'+
	'0\tMoraxella catarrhalis\tPenicillin G\n'+
	'0\tMoraxella catarrhalis\tPenicillin V\n'+
	'50\tMoraxella catarrhalis\tPiperacillin\n'+
	'90\tMoraxella catarrhalis\tPiperacillin-Tazobactam\n'+
	'50\tMoraxella catarrhalis\tQuinupristin-Dalfopristin\n'+
	'90\tMoraxella catarrhalis\tRifampin (not for Staph monotherapy)\n'+
	'50\tMoraxella catarrhalis\tTMP-SMX\n'+
	'90\tMoraxella catarrhalis\tTelithromycin\n'+
	'0\tMoraxella catarrhalis\tTicarcillin\n'+
	'90\tMoraxella catarrhalis\tTicarcillin-Clavulanate\n'+
	'90\tMoraxella catarrhalis\tTigecycline\n'+
	'90\tMoraxella catarrhalis\tTobramycin\n'+
	'50\tMoraxella catarrhalis\tTrimethoprim\n'+
	'50\tMorganella\tAmoxicillin-Clavulanate\n'+
	'90\tMorganella\tAmpicillin-Sulbactam\n'+
	'0\tMorganella\tAmpicillin/Amoxicillin\n'+
	'90\tMorganella\tAztreonam\n'+
	'0\tMorganella\tCefaclor/Loracarbef\n'+
	'0\tMorganella\tCefadroxil\n'+
	'0\tMorganella\tCefazolin\n'+
	'90\tMorganella\tCefepime\n'+
	'0\tMorganella\tCefixime\n'+
	'90\tMorganella\tCefotaxime\n'+
	'90\tMorganella\tCefotetan\n'+
	'90\tMorganella\tCefoxitin\n'+
	'0\tMorganella\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tMorganella\tCefprozil\n'+
	'90\tMorganella\tCeftaroline\n'+
	'90\tMorganella\tCeftazidime\n'+
	'0\tMorganella\tCeftibuten\n'+
	'90\tMorganella\tCeftizoxime\n'+
	'90\tMorganella\tCeftobiprole\n'+
	'90\tMorganella\tCeftriaxone\n'+
	'50\tMorganella\tCefuroxime\n'+
	'0\tMorganella\tCephalexin\n'+
	'90\tMorganella\tCiprofloxacin\n'+
	'0\tMorganella\tCloxacillin/Dicloxacilin\n'+
	'90\tMorganella\tDoripenem\n'+
	'90\tMorganella\tErtapenem\n'+
	'90\tMorganella\tGatifloxacin\n'+
	'90\tMorganella\tImipenem\n'+
	'90\tMorganella\tLevofloxacin\n'+
	'90\tMorganella\tMeropenem\n'+
	'0\tMorganella\tMethicillin\n'+
	'90\tMorganella\tMoxifloxacin\n'+
	'0\tMorganella\tNafcillin/Oxacillin\n'+
	'90\tMorganella\tOfloxacin\n'+
	'90\tMorganella\tPefloxacin\n'+
	'0\tMorganella\tPenicillin G\n'+
	'0\tMorganella\tPenicillin V\n'+
	'90\tMorganella\tPiperacillin\n'+
	'90\tMorganella\tPiperacillin-Tazobactam\n'+
	'90\tMorganella\tTicarcillin\n'+
	'90\tMorganella\tTicarcillin-Clavulanate\n'+
	'0\tMycobacterium avium\tAmikacin\n'+
	'90\tMycobacterium avium\tAzithromycin\n'+
	'90\tMycobacterium avium\tChloramphenicol\n'+
	'90\tMycobacterium avium\tClarithromycin\n'+
	'90\tMycobacterium avium\tClindamycin\n'+
	'90\tMycobacterium avium\tDoxycycline\n'+
	'90\tMycobacterium avium\tErythromycin\n'+
	'90\tMycobacterium avium\tFusidic Acid\n'+
	'0\tMycobacterium avium\tGentamicin\n'+
	'0\tMycobacterium avium\tMetronidazole\n'+
	'90\tMycobacterium avium\tMinocycline\n'+
	'90\tMycobacterium avium\tTelavancin\n'+
	'0\tMycobacterium avium\tTobramycin\n'+
	'90\tMycobacterium avium\tVancomycin\n'+
	'0\tMycoplasma pneumoniae\tAmikacin\n'+
	'0\tMycoplasma pneumoniae\tAmoxicillin-Clavulanate\n'+
	'0\tMycoplasma pneumoniae\tAmpicillin-Sulbactam\n'+
	'0\tMycoplasma pneumoniae\tAmpicillin/Amoxicillin\n'+
	'0\tMycoplasma pneumoniae\tAztreonam\n'+
	'90\tMycoplasma pneumoniae\tChloramphenicol\n'+
	'90\tMycoplasma pneumoniae\tCiprofloxacin\n'+
	'0\tMycoplasma pneumoniae\tCloxacillin/Dicloxacilin\n'+
	'0\tMycoplasma pneumoniae\tDoripenem\n'+
	'90\tMycoplasma pneumoniae\tDoxycycline\n'+
	'0\tMycoplasma pneumoniae\tErtapenem\n'+
	'50\tMycoplasma pneumoniae\tErythromycin\n'+
	'0\tMycoplasma pneumoniae\tFusidic Acid\n'+
	'90\tMycoplasma pneumoniae\tGatifloxacin\n'+
	'90\tMycoplasma pneumoniae\tGemifloxacin\n'+
	'0\tMycoplasma pneumoniae\tGentamicin\n'+
	'0\tMycoplasma pneumoniae\tImipenem\n'+
	'90\tMycoplasma pneumoniae\tLevofloxacin\n'+
	'0\tMycoplasma pneumoniae\tMeropenem\n'+
	'0\tMycoplasma pneumoniae\tMethicillin\n'+
	'0\tMycoplasma pneumoniae\tMetronidazole\n'+
	'90\tMycoplasma pneumoniae\tMinocycline\n'+
	'90\tMycoplasma pneumoniae\tMoxifloxacin\n'+
	'0\tMycoplasma pneumoniae\tNafcillin/Oxacillin\n'+
	'90\tMycoplasma pneumoniae\tOfloxacin\n'+
	'90\tMycoplasma pneumoniae\tPefloxacin\n'+
	'0\tMycoplasma pneumoniae\tPenicillin G\n'+
	'0\tMycoplasma pneumoniae\tPenicillin V\n'+
	'0\tMycoplasma pneumoniae\tPiperacillin\n'+
	'0\tMycoplasma pneumoniae\tPiperacillin-Tazobactam\n'+
	'0\tMycoplasma pneumoniae\tTeicoplanin\n'+
	'0\tMycoplasma pneumoniae\tTelavancin\n'+
	'90\tMycoplasma pneumoniae\tTelithromycin\n'+
	'0\tMycoplasma pneumoniae\tTicarcillin\n'+
	'0\tMycoplasma pneumoniae\tTicarcillin-Clavulanate\n'+
	'0\tMycoplasma pneumoniae\tTobramycin\n'+
	'0\tMycoplasma pneumoniae\tVancomycin\n'+
	'0\tNeisseria gonorrhoeae\tAmikacin\n'+
	'90\tNeisseria gonorrhoeae\tAmoxicillin-Clavulanate\n'+
	'90\tNeisseria gonorrhoeae\tAmpicillin-Sulbactam\n'+
	'0\tNeisseria gonorrhoeae\tAmpicillin/Amoxicillin\n'+
	'90\tNeisseria gonorrhoeae\tAzithromycin\n'+
	'90\tNeisseria gonorrhoeae\tAztreonam\n'+
	'50\tNeisseria gonorrhoeae\tCefaclor/Loracarbef\n'+
	'0\tNeisseria gonorrhoeae\tCefadroxil\n'+
	'90\tNeisseria gonorrhoeae\tCefazolin\n'+
	'90\tNeisseria gonorrhoeae\tCefepime\n'+
	'90\tNeisseria gonorrhoeae\tCefixime\n'+
	'50\tNeisseria gonorrhoeae\tCefotaxime\n'+
	'50\tNeisseria gonorrhoeae\tCefotetan\n'+
	'50\tNeisseria gonorrhoeae\tCefoxitin\n'+
	'90\tNeisseria gonorrhoeae\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'50\tNeisseria gonorrhoeae\tCefprozil\n'+
	'90\tNeisseria gonorrhoeae\tCeftaroline\n'+
	'50\tNeisseria gonorrhoeae\tCeftazidime\n'+
	'50\tNeisseria gonorrhoeae\tCeftibuten\n'+
	'50\tNeisseria gonorrhoeae\tCeftizoxime\n'+
	'90\tNeisseria gonorrhoeae\tCeftobiprole\n'+
	'90\tNeisseria gonorrhoeae\tCeftriaxone\n'+
	'50\tNeisseria gonorrhoeae\tCefuroxime\n'+
	'0\tNeisseria gonorrhoeae\tCephalexin\n'+
	'90\tNeisseria gonorrhoeae\tChloramphenicol\n'+
	'50\tNeisseria gonorrhoeae\tCiprofloxacin\n'+
	'0\tNeisseria gonorrhoeae\tClindamycin\n'+
	'0\tNeisseria gonorrhoeae\tCloxacillin/Dicloxacilin\n'+
	'0\tNeisseria gonorrhoeae\tColistimethate\n'+
	'0\tNeisseria gonorrhoeae\tDaptomycin (non-pneumonia)\n'+
	'90\tNeisseria gonorrhoeae\tDoripenem\n'+
	'90\tNeisseria gonorrhoeae\tDoxycycline\n'+
	'90\tNeisseria gonorrhoeae\tErtapenem\n'+
	'90\tNeisseria gonorrhoeae\tErythromycin\n'+
	'90\tNeisseria gonorrhoeae\tFusidic Acid\n'+
	'90\tNeisseria gonorrhoeae\tGatifloxacin\n'+
	'0\tNeisseria gonorrhoeae\tGentamicin\n'+
	'90\tNeisseria gonorrhoeae\tImipenem\n'+
	'50\tNeisseria gonorrhoeae\tLevofloxacin\n'+
	'0\tNeisseria gonorrhoeae\tLinezolid\n'+
	'90\tNeisseria gonorrhoeae\tMeropenem\n'+
	'0\tNeisseria gonorrhoeae\tMethicillin\n'+
	'0\tNeisseria gonorrhoeae\tMetronidazole\n'+
	'90\tNeisseria gonorrhoeae\tMinocycline\n'+
	'90\tNeisseria gonorrhoeae\tMoxifloxacin\n'+
	'0\tNeisseria gonorrhoeae\tNafcillin/Oxacillin\n'+
	'50\tNeisseria gonorrhoeae\tOfloxacin\n'+
	'50\tNeisseria gonorrhoeae\tPefloxacin\n'+
	'0\tNeisseria gonorrhoeae\tPenicillin G\n'+
	'0\tNeisseria gonorrhoeae\tPenicillin V\n'+
	'90\tNeisseria gonorrhoeae\tPiperacillin\n'+
	'90\tNeisseria gonorrhoeae\tPiperacillin-Tazobactam\n'+
	'0\tNeisseria gonorrhoeae\tQuinupristin-Dalfopristin\n'+
	'90\tNeisseria gonorrhoeae\tRifampin (not for Staph monotherapy)\n'+
	'90\tNeisseria gonorrhoeae\tTMP-SMX\n'+
	'0\tNeisseria gonorrhoeae\tTeicoplanin\n'+
	'0\tNeisseria gonorrhoeae\tTelavancin\n'+
	'90\tNeisseria gonorrhoeae\tTelithromycin\n'+
	'90\tNeisseria gonorrhoeae\tTicarcillin\n'+
	'90\tNeisseria gonorrhoeae\tTicarcillin-Clavulanate\n'+
	'0\tNeisseria gonorrhoeae\tTobramycin\n'+
	'50\tNeisseria gonorrhoeae\tTrimethoprim\n'+
	'0\tNeisseria gonorrhoeae\tVancomycin\n'+
	'90\tNeisseria meningitidis\tAmikacin\n'+
	'90\tNeisseria meningitidis\tAmoxicillin-Clavulanate\n'+
	'90\tNeisseria meningitidis\tAmpicillin-Sulbactam\n'+
	'90\tNeisseria meningitidis\tAmpicillin/Amoxicillin\n'+
	'90\tNeisseria meningitidis\tAzithromycin\n'+
	'90\tNeisseria meningitidis\tAztreonam\n'+
	'50\tNeisseria meningitidis\tCefaclor/Loracarbef\n'+
	'0\tNeisseria meningitidis\tCefadroxil\n'+
	'0\tNeisseria meningitidis\tCefazolin\n'+
	'90\tNeisseria meningitidis\tCefepime\n'+
	'50\tNeisseria meningitidis\tCefixime\n'+
	'90\tNeisseria meningitidis\tCefotaxime\n'+
	'50\tNeisseria meningitidis\tCefotetan\n'+
	'50\tNeisseria meningitidis\tCefoxitin\n'+
	'50\tNeisseria meningitidis\tCefprozil\n'+
	'90\tNeisseria meningitidis\tCeftaroline\n'+
	'50\tNeisseria meningitidis\tCeftazidime\n'+
	'50\tNeisseria meningitidis\tCeftibuten\n'+
	'50\tNeisseria meningitidis\tCeftizoxime\n'+
	'90\tNeisseria meningitidis\tCeftobiprole\n'+
	'90\tNeisseria meningitidis\tCeftriaxone\n'+
	'50\tNeisseria meningitidis\tCefuroxime\n'+
	'0\tNeisseria meningitidis\tCephalexin\n'+
	'90\tNeisseria meningitidis\tChloramphenicol\n'+
	'90\tNeisseria meningitidis\tCiprofloxacin\n'+
	'90\tNeisseria meningitidis\tClarithromycin\n'+
	'0\tNeisseria meningitidis\tClindamycin\n'+
	'0\tNeisseria meningitidis\tCloxacillin/Dicloxacilin\n'+
	'0\tNeisseria meningitidis\tDaptomycin (non-pneumonia)\n'+
	'90\tNeisseria meningitidis\tDoripenem\n'+
	'90\tNeisseria meningitidis\tDoxycycline\n'+
	'90\tNeisseria meningitidis\tErtapenem\n'+
	'90\tNeisseria meningitidis\tErythromycin\n'+
	'90\tNeisseria meningitidis\tGatifloxacin\n'+
	'90\tNeisseria meningitidis\tGentamicin\n'+
	'90\tNeisseria meningitidis\tImipenem\n'+
	'90\tNeisseria meningitidis\tLevofloxacin\n'+
	'50\tNeisseria meningitidis\tLinezolid\n'+
	'90\tNeisseria meningitidis\tMeropenem\n'+
	'0\tNeisseria meningitidis\tMethicillin\n'+
	'0\tNeisseria meningitidis\tMetronidazole\n'+
	'90\tNeisseria meningitidis\tMinocycline\n'+
	'90\tNeisseria meningitidis\tMoxifloxacin\n'+
	'0\tNeisseria meningitidis\tNafcillin/Oxacillin\n'+
	'90\tNeisseria meningitidis\tOfloxacin\n'+
	'90\tNeisseria meningitidis\tPefloxacin\n'+
	'90\tNeisseria meningitidis\tPenicillin G\n'+
	'0\tNeisseria meningitidis\tPenicillin V\n'+
	'90\tNeisseria meningitidis\tPiperacillin\n'+
	'90\tNeisseria meningitidis\tPiperacillin-Tazobactam\n'+
	'90\tNeisseria meningitidis\tQuinupristin-Dalfopristin\n'+
	'90\tNeisseria meningitidis\tRifampin (not for Staph monotherapy)\n'+
	'90\tNeisseria meningitidis\tTMP-SMX\n'+
	'90\tNeisseria meningitidis\tTelithromycin\n'+
	'90\tNeisseria meningitidis\tTicarcillin\n'+
	'90\tNeisseria meningitidis\tTicarcillin-Clavulanate\n'+
	'90\tNeisseria meningitidis\tTigecycline\n'+
	'90\tNeisseria meningitidis\tTobramycin\n'+
	'90\tPasteurella multocida\tAmoxicillin-Clavulanate\n'+
	'90\tPasteurella multocida\tAmpicillin-Sulbactam\n'+
	'90\tPasteurella multocida\tAmpicillin/Amoxicillin\n'+
	'90\tPasteurella multocida\tAztreonam\n'+
	'90\tPasteurella multocida\tCefepime\n'+
	'90\tPasteurella multocida\tCefixime\n'+
	'90\tPasteurella multocida\tCefotaxime\n'+
	'90\tPasteurella multocida\tCefotetan\n'+
	'90\tPasteurella multocida\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tPasteurella multocida\tCeftizoxime\n'+
	'90\tPasteurella multocida\tCeftriaxone\n'+
	'90\tPasteurella multocida\tCefuroxime\n'+
	'0\tPasteurella multocida\tCephalexin\n'+
	'90\tPasteurella multocida\tCiprofloxacin\n'+
	'0\tPasteurella multocida\tCloxacillin/Dicloxacilin\n'+
	'90\tPasteurella multocida\tDoripenem\n'+
	'90\tPasteurella multocida\tErtapenem\n'+
	'90\tPasteurella multocida\tGatifloxacin\n'+
	'90\tPasteurella multocida\tImipenem\n'+
	'90\tPasteurella multocida\tLevofloxacin\n'+
	'0\tPasteurella multocida\tMethicillin\n'+
	'90\tPasteurella multocida\tMoxifloxacin\n'+
	'0\tPasteurella multocida\tNafcillin/Oxacillin\n'+
	'90\tPasteurella multocida\tOfloxacin\n'+
	'90\tPasteurella multocida\tPefloxacin\n'+
	'90\tPasteurella multocida\tPenicillin G\n'+
	'90\tPasteurella multocida\tPenicillin V\n'+
	'90\tPasteurella multocida\tPiperacillin\n'+
	'90\tPasteurella multocida\tTicarcillin\n'+
	'90\tPasteurella multocida\tTicarcillin-Clavulanate\n'+
	'90\tPeptostreptococcus\tAmoxicillin-Clavulanate\n'+
	'90\tPeptostreptococcus\tAmpicillin-Sulbactam\n'+
	'90\tPeptostreptococcus\tAmpicillin/Amoxicillin\n'+
	'0\tPeptostreptococcus\tAztreonam\n'+
	'90\tPeptostreptococcus\tCefaclor/Loracarbef\n'+
	'90\tPeptostreptococcus\tCefepime\n'+
	'90\tPeptostreptococcus\tCefixime\n'+
	'90\tPeptostreptococcus\tCefotaxime\n'+
	'90\tPeptostreptococcus\tCefotetan\n'+
	'90\tPeptostreptococcus\tCefoxitin\n'+
	'90\tPeptostreptococcus\tCefprozil\n'+
	'90\tPeptostreptococcus\tCeftazidime\n'+
	'90\tPeptostreptococcus\tCeftizoxime\n'+
	'90\tPeptostreptococcus\tCeftobiprole\n'+
	'90\tPeptostreptococcus\tCeftriaxone\n'+
	'90\tPeptostreptococcus\tCefuroxime\n'+
	'90\tPeptostreptococcus\tCephalexin\n'+
	'50\tPeptostreptococcus\tCiprofloxacin\n'+
	'90\tPeptostreptococcus\tCloxacillin/Dicloxacilin\n'+
	'90\tPeptostreptococcus\tDoripenem\n'+
	'90\tPeptostreptococcus\tErtapenem\n'+
	'90\tPeptostreptococcus\tGatifloxacin\n'+
	'90\tPeptostreptococcus\tImipenem\n'+
	'90\tPeptostreptococcus\tLevofloxacin\n'+
	'90\tPeptostreptococcus\tMeropenem\n'+
	'90\tPeptostreptococcus\tMethicillin\n'+
	'90\tPeptostreptococcus\tMoxifloxacin\n'+
	'90\tPeptostreptococcus\tNafcillin/Oxacillin\n'+
	'50\tPeptostreptococcus\tOfloxacin\n'+
	'90\tPeptostreptococcus\tPenicillin G\n'+
	'90\tPeptostreptococcus\tPenicillin V\n'+
	'90\tPeptostreptococcus\tPiperacillin\n'+
	'90\tPeptostreptococcus\tPiperacillin-Tazobactam\n'+
	'90\tPeptostreptococcus\tTicarcillin\n'+
	'90\tPeptostreptococcus\tTicarcillin-Clavulanate\n'+
	'0\tPrevotella melaninogenica\tAmikacin\n'+
	'90\tPrevotella melaninogenica\tAmoxicillin-Clavulanate\n'+
	'90\tPrevotella melaninogenica\tAmpicillin-Sulbactam\n'+
	'90\tPrevotella melaninogenica\tAmpicillin/Amoxicillin\n'+
	'0\tPrevotella melaninogenica\tAztreonam\n'+
	'90\tPrevotella melaninogenica\tCefaclor/Loracarbef\n'+
	'0\tPrevotella melaninogenica\tCefepime\n'+
	'90\tPrevotella melaninogenica\tCefixime\n'+
	'90\tPrevotella melaninogenica\tCefotaxime\n'+
	'90\tPrevotella melaninogenica\tCefotetan\n'+
	'90\tPrevotella melaninogenica\tCefoxitin\n'+
	'90\tPrevotella melaninogenica\tCefprozil\n'+
	'90\tPrevotella melaninogenica\tCeftazidime\n'+
	'90\tPrevotella melaninogenica\tCeftizoxime\n'+
	'50\tPrevotella melaninogenica\tCeftobiprole\n'+
	'50\tPrevotella melaninogenica\tCeftriaxone\n'+
	'90\tPrevotella melaninogenica\tCefuroxime\n'+
	'50\tPrevotella melaninogenica\tChloramphenicol\n'+
	'0\tPrevotella melaninogenica\tCiprofloxacin\n'+
	'0\tPrevotella melaninogenica\tCloxacillin/Dicloxacilin\n'+
	'90\tPrevotella melaninogenica\tDoripenem\n'+
	'90\tPrevotella melaninogenica\tErtapenem\n'+
	'90\tPrevotella melaninogenica\tGatifloxacin\n'+
	'0\tPrevotella melaninogenica\tGentamicin\n'+
	'90\tPrevotella melaninogenica\tImipenem\n'+
	'90\tPrevotella melaninogenica\tLevofloxacin\n'+
	'50\tPrevotella melaninogenica\tLinezolid\n'+
	'90\tPrevotella melaninogenica\tMeropenem\n'+
	'0\tPrevotella melaninogenica\tMethicillin\n'+
	'90\tPrevotella melaninogenica\tMetronidazole\n'+
	'90\tPrevotella melaninogenica\tMoxifloxacin\n'+
	'0\tPrevotella melaninogenica\tNafcillin/Oxacillin\n'+
	'50\tPrevotella melaninogenica\tOfloxacin\n'+
	'90\tPrevotella melaninogenica\tPenicillin G\n'+
	'0\tPrevotella melaninogenica\tPenicillin V\n'+
	'90\tPrevotella melaninogenica\tPiperacillin\n'+
	'90\tPrevotella melaninogenica\tPiperacillin-Tazobactam\n'+
	'50\tPrevotella melaninogenica\tQuinupristin-Dalfopristin\n'+
	'90\tPrevotella melaninogenica\tTeicoplanin\n'+
	'90\tPrevotella melaninogenica\tTelavancin\n'+
	'90\tPrevotella melaninogenica\tTicarcillin\n'+
	'90\tPrevotella melaninogenica\tTicarcillin-Clavulanate\n'+
	'0\tPrevotella melaninogenica\tTobramycin\n'+
	'90\tPrevotella melaninogenica\tVancomycin\n'+
	'90\tProteus mirabilis\tAmoxicillin-Clavulanate\n'+
	'90\tProteus mirabilis\tAmpicillin-Sulbactam\n'+
	'90\tProteus mirabilis\tAmpicillin/Amoxicillin\n'+
	'90\tProteus mirabilis\tAztreonam\n'+
	'90\tProteus mirabilis\tCefaclor/Loracarbef\n'+
	'90\tProteus mirabilis\tCefadroxil\n'+
	'90\tProteus mirabilis\tCefazolin\n'+
	'90\tProteus mirabilis\tCefepime\n'+
	'90\tProteus mirabilis\tCefixime\n'+
	'90\tProteus mirabilis\tCefotaxime\n'+
	'90\tProteus mirabilis\tCefotetan\n'+
	'90\tProteus mirabilis\tCefoxitin\n'+
	'90\tProteus mirabilis\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tProteus mirabilis\tCefprozil\n'+
	'90\tProteus mirabilis\tCeftaroline\n'+
	'90\tProteus mirabilis\tCeftazidime\n'+
	'90\tProteus mirabilis\tCeftibuten\n'+
	'90\tProteus mirabilis\tCeftizoxime\n'+
	'90\tProteus mirabilis\tCeftobiprole\n'+
	'90\tProteus mirabilis\tCeftriaxone\n'+
	'90\tProteus mirabilis\tCefuroxime\n'+
	'90\tProteus mirabilis\tCephalexin\n'+
	'90\tProteus mirabilis\tCiprofloxacin\n'+
	'0\tProteus mirabilis\tCloxacillin/Dicloxacilin\n'+
	'90\tProteus mirabilis\tDoripenem\n'+
	'90\tProteus mirabilis\tErtapenem\n'+
	'90\tProteus mirabilis\tGatifloxacin\n'+
	'90\tProteus mirabilis\tImipenem\n'+
	'90\tProteus mirabilis\tLevofloxacin\n'+
	'90\tProteus mirabilis\tMeropenem\n'+
	'0\tProteus mirabilis\tMethicillin\n'+
	'90\tProteus mirabilis\tMoxifloxacin\n'+
	'0\tProteus mirabilis\tNafcillin/Oxacillin\n'+
	'90\tProteus mirabilis\tOfloxacin\n'+
	'90\tProteus mirabilis\tPefloxacin\n'+
	'0\tProteus mirabilis\tPenicillin G\n'+
	'0\tProteus mirabilis\tPenicillin V\n'+
	'90\tProteus mirabilis\tPiperacillin\n'+
	'90\tProteus mirabilis\tPiperacillin-Tazobactam\n'+
	'90\tProteus mirabilis\tTicarcillin\n'+
	'90\tProteus mirabilis\tTicarcillin-Clavulanate\n'+
	'50\tProteus vulgaris\tAmikacin\n'+
	'90\tProteus vulgaris\tAmoxicillin-Clavulanate\n'+
	'90\tProteus vulgaris\tAmpicillin-Sulbactam\n'+
	'0\tProteus vulgaris\tAmpicillin/Amoxicillin\n'+
	'0\tProteus vulgaris\tAzithromycin\n'+
	'90\tProteus vulgaris\tAztreonam\n'+
	'0\tProteus vulgaris\tCefaclor/Loracarbef\n'+
	'0\tProteus vulgaris\tCefadroxil\n'+
	'0\tProteus vulgaris\tCefazolin\n'+
	'90\tProteus vulgaris\tCefepime\n'+
	'90\tProteus vulgaris\tCefixime\n'+
	'90\tProteus vulgaris\tCefotaxime\n'+
	'90\tProteus vulgaris\tCefotetan\n'+
	'90\tProteus vulgaris\tCefoxitin\n'+
	'50\tProteus vulgaris\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tProteus vulgaris\tCefprozil\n'+
	'90\tProteus vulgaris\tCeftaroline\n'+
	'90\tProteus vulgaris\tCeftazidime\n'+
	'90\tProteus vulgaris\tCeftibuten\n'+
	'90\tProteus vulgaris\tCeftizoxime\n'+
	'90\tProteus vulgaris\tCeftobiprole\n'+
	'90\tProteus vulgaris\tCeftriaxone\n'+
	'0\tProteus vulgaris\tCefuroxime\n'+
	'0\tProteus vulgaris\tCephalexin\n'+
	'0\tProteus vulgaris\tChloramphenicol\n'+
	'90\tProteus vulgaris\tCiprofloxacin\n'+
	'0\tProteus vulgaris\tClarithromycin\n'+
	'0\tProteus vulgaris\tClindamycin\n'+
	'0\tProteus vulgaris\tCloxacillin/Dicloxacilin\n'+
	'90\tProteus vulgaris\tColistimethate\n'+
	'0\tProteus vulgaris\tDaptomycin (non-pneumonia)\n'+
	'90\tProteus vulgaris\tDoripenem\n'+
	'0\tProteus vulgaris\tDoxycycline\n'+
	'90\tProteus vulgaris\tErtapenem\n'+
	'0\tProteus vulgaris\tErythromycin\n'+
	'0\tProteus vulgaris\tFusidic Acid\n'+
	'90\tProteus vulgaris\tGatifloxacin\n'+
	'90\tProteus vulgaris\tGemifloxacin\n'+
	'0\tProteus vulgaris\tGentamicin\n'+
	'90\tProteus vulgaris\tImipenem\n'+
	'90\tProteus vulgaris\tLevofloxacin\n'+
	'0\tProteus vulgaris\tLinezolid\n'+
	'90\tProteus vulgaris\tMeropenem\n'+
	'0\tProteus vulgaris\tMethicillin\n'+
	'0\tProteus vulgaris\tMetronidazole\n'+
	'0\tProteus vulgaris\tMinocycline\n'+
	'90\tProteus vulgaris\tMoxifloxacin\n'+
	'0\tProteus vulgaris\tNafcillin/Oxacillin\n'+
	'90\tProteus vulgaris\tOfloxacin\n'+
	'90\tProteus vulgaris\tPefloxacin\n'+
	'0\tProteus vulgaris\tPenicillin G\n'+
	'0\tProteus vulgaris\tPenicillin V\n'+
	'90\tProteus vulgaris\tPiperacillin\n'+
	'90\tProteus vulgaris\tPiperacillin-Tazobactam\n'+
	'0\tProteus vulgaris\tRifampin (not for Staph monotherapy)\n'+
	'50\tProteus vulgaris\tTMP-SMX\n'+
	'0\tProteus vulgaris\tTeicoplanin\n'+
	'0\tProteus vulgaris\tTelavancin\n'+
	'0\tProteus vulgaris\tTelithromycin\n'+
	'90\tProteus vulgaris\tTicarcillin\n'+
	'90\tProteus vulgaris\tTicarcillin-Clavulanate\n'+
	'50\tProteus vulgaris\tTigecycline\n'+
	'0\tProteus vulgaris\tTobramycin\n'+
	'0\tProteus vulgaris\tTrimethoprim\n'+
	'0\tProteus vulgaris\tVancomycin\n'+
	'90\tProvidencia\tAmoxicillin-Clavulanate\n'+
	'90\tProvidencia\tAmpicillin-Sulbactam\n'+
	'0\tProvidencia\tAmpicillin/Amoxicillin\n'+
	'90\tProvidencia\tAztreonam\n'+
	'0\tProvidencia\tCefaclor/Loracarbef\n'+
	'0\tProvidencia\tCefadroxil\n'+
	'0\tProvidencia\tCefazolin\n'+
	'90\tProvidencia\tCefepime\n'+
	'90\tProvidencia\tCefixime\n'+
	'90\tProvidencia\tCefotaxime\n'+
	'90\tProvidencia\tCefotetan\n'+
	'90\tProvidencia\tCefoxitin\n'+
	'0\tProvidencia\tCefprozil\n'+
	'90\tProvidencia\tCeftaroline\n'+
	'90\tProvidencia\tCeftazidime\n'+
	'90\tProvidencia\tCeftibuten\n'+
	'90\tProvidencia\tCeftizoxime\n'+
	'90\tProvidencia\tCeftobiprole\n'+
	'90\tProvidencia\tCeftriaxone\n'+
	'90\tProvidencia\tCefuroxime\n'+
	'0\tProvidencia\tCephalexin\n'+
	'90\tProvidencia\tCiprofloxacin\n'+
	'0\tProvidencia\tCloxacillin/Dicloxacilin\n'+
	'90\tProvidencia\tDoripenem\n'+
	'90\tProvidencia\tErtapenem\n'+
	'90\tProvidencia\tGatifloxacin\n'+
	'90\tProvidencia\tImipenem\n'+
	'90\tProvidencia\tLevofloxacin\n'+
	'90\tProvidencia\tMeropenem\n'+
	'0\tProvidencia\tMethicillin\n'+
	'90\tProvidencia\tMoxifloxacin\n'+
	'0\tProvidencia\tNafcillin/Oxacillin\n'+
	'90\tProvidencia\tOfloxacin\n'+
	'90\tProvidencia\tPefloxacin\n'+
	'0\tProvidencia\tPenicillin G\n'+
	'0\tProvidencia\tPenicillin V\n'+
	'90\tProvidencia\tPiperacillin\n'+
	'90\tProvidencia\tPiperacillin-Tazobactam\n'+
	'90\tProvidencia\tTicarcillin\n'+
	'90\tProvidencia\tTicarcillin-Clavulanate\n'+
	'0\tPseudomonas aeruginosa\tAmikacin\n'+
	'0\tPseudomonas aeruginosa\tAmoxicillin-Clavulanate\n'+
	'0\tPseudomonas aeruginosa\tAmpicillin-Sulbactam\n'+
	'0\tPseudomonas aeruginosa\tAmpicillin/Amoxicillin\n'+
	'0\tPseudomonas aeruginosa\tAzithromycin\n'+
	'90\tPseudomonas aeruginosa\tAztreonam\n'+
	'0\tPseudomonas aeruginosa\tCefaclor/Loracarbef\n'+
	'0\tPseudomonas aeruginosa\tCefadroxil\n'+
	'0\tPseudomonas aeruginosa\tCefazolin\n'+
	'90\tPseudomonas aeruginosa\tCefepime\n'+
	'0\tPseudomonas aeruginosa\tCefixime\n'+
	'50\tPseudomonas aeruginosa\tCefotaxime\n'+
	'0\tPseudomonas aeruginosa\tCefotetan\n'+
	'0\tPseudomonas aeruginosa\tCefoxitin\n'+
	'0\tPseudomonas aeruginosa\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tPseudomonas aeruginosa\tCefprozil\n'+
	'50\tPseudomonas aeruginosa\tCeftaroline\n'+
	'90\tPseudomonas aeruginosa\tCeftazidime\n'+
	'0\tPseudomonas aeruginosa\tCeftibuten\n'+
	'50\tPseudomonas aeruginosa\tCeftizoxime\n'+
	'90\tPseudomonas aeruginosa\tCeftobiprole\n'+
	'50\tPseudomonas aeruginosa\tCeftriaxone\n'+
	'0\tPseudomonas aeruginosa\tCefuroxime\n'+
	'0\tPseudomonas aeruginosa\tCephalexin\n'+
	'90\tPseudomonas aeruginosa\tChloramphenicol\n'+
	'90\tPseudomonas aeruginosa\tCiprofloxacin\n'+
	'0\tPseudomonas aeruginosa\tClarithromycin\n'+
	'0\tPseudomonas aeruginosa\tClindamycin\n'+
	'0\tPseudomonas aeruginosa\tCloxacillin/Dicloxacilin\n'+
	'0\tPseudomonas aeruginosa\tColistimethate\n'+
	'0\tPseudomonas aeruginosa\tDaptomycin (non-pneumonia)\n'+
	'90\tPseudomonas aeruginosa\tDoripenem\n'+
	'0\tPseudomonas aeruginosa\tDoxycycline\n'+
	'0\tPseudomonas aeruginosa\tErtapenem\n'+
	'0\tPseudomonas aeruginosa\tErythromycin\n'+
	'0\tPseudomonas aeruginosa\tFusidic Acid\n'+
	'50\tPseudomonas aeruginosa\tGatifloxacin\n'+
	'0\tPseudomonas aeruginosa\tGentamicin\n'+
	'90\tPseudomonas aeruginosa\tImipenem\n'+
	'50\tPseudomonas aeruginosa\tLevofloxacin\n'+
	'0\tPseudomonas aeruginosa\tLinezolid\n'+
	'90\tPseudomonas aeruginosa\tMeropenem\n'+
	'0\tPseudomonas aeruginosa\tMethicillin\n'+
	'0\tPseudomonas aeruginosa\tMetronidazole\n'+
	'50\tPseudomonas aeruginosa\tMinocycline\n'+
	'50\tPseudomonas aeruginosa\tMoxifloxacin\n'+
	'0\tPseudomonas aeruginosa\tNafcillin/Oxacillin\n'+
	'0\tPseudomonas aeruginosa\tNitrofurantoin (uncomplicated UTI)\n'+
	'50\tPseudomonas aeruginosa\tOfloxacin\n'+
	'0\tPseudomonas aeruginosa\tPenicillin G\n'+
	'0\tPseudomonas aeruginosa\tPenicillin V\n'+
	'90\tPseudomonas aeruginosa\tPiperacillin\n'+
	'90\tPseudomonas aeruginosa\tPiperacillin-Tazobactam\n'+
	'0\tPseudomonas aeruginosa\tRifampin (not for Staph monotherapy)\n'+
	'90\tPseudomonas aeruginosa\tTMP-SMX\n'+
	'0\tPseudomonas aeruginosa\tTeicoplanin\n'+
	'0\tPseudomonas aeruginosa\tTelavancin\n'+
	'0\tPseudomonas aeruginosa\tTelithromycin\n'+
	'90\tPseudomonas aeruginosa\tTicarcillin\n'+
	'90\tPseudomonas aeruginosa\tTicarcillin-Clavulanate\n'+
	'50\tPseudomonas aeruginosa\tTigecycline\n'+
	'0\tPseudomonas aeruginosa\tTobramycin\n'+
	'90\tPseudomonas aeruginosa\tTrimethoprim\n'+
	'0\tPseudomonas aeruginosa\tVancomycin\n'+
	'90\tRickettsia\tAmikacin\n'+
	'90\tRickettsia\tAzithromycin\n'+
	'90\tRickettsia\tClarithromycin\n'+
	'0\tRickettsia\tDoxycycline\n'+
	'0\tRickettsia\tLinezolid\n'+
	'0\tRickettsia\tMetronidazole\n'+
	'0\tRickettsia\tMinocycline\n'+
	'0\tRickettsia\tQuinupristin-Dalfopristin\n'+
	'0\tRickettsia\tTigecycline\n'+
	'90\tSalmonella\tAmikacin\n'+
	'90\tSalmonella\tAmoxicillin-Clavulanate\n'+
	'90\tSalmonella\tAmpicillin-Sulbactam\n'+
	'50\tSalmonella\tAmpicillin/Amoxicillin\n'+
	'50\tSalmonella\tAzithromycin\n'+
	'0\tSalmonella\tCefadroxil\n'+
	'90\tSalmonella\tCefepime\n'+
	'90\tSalmonella\tCefixime\n'+
	'90\tSalmonella\tCefotaxime\n'+
	'90\tSalmonella\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tSalmonella\tCeftaroline\n'+
	'90\tSalmonella\tCeftazidime\n'+
	'90\tSalmonella\tCeftibuten\n'+
	'90\tSalmonella\tCeftizoxime\n'+
	'90\tSalmonella\tCeftobiprole\n'+
	'90\tSalmonella\tCeftriaxone\n'+
	'0\tSalmonella\tCephalexin\n'+
	'90\tSalmonella\tChloramphenicol\n'+
	'90\tSalmonella\tCiprofloxacin\n'+
	'0\tSalmonella\tClarithromycin\n'+
	'0\tSalmonella\tClindamycin\n'+
	'0\tSalmonella\tCloxacillin/Dicloxacilin\n'+
	'0\tSalmonella\tDaptomycin (non-pneumonia)\n'+
	'90\tSalmonella\tDoripenem\n'+
	'50\tSalmonella\tDoxycycline\n'+
	'90\tSalmonella\tErtapenem\n'+
	'0\tSalmonella\tErythromycin\n'+
	'0\tSalmonella\tFusidic Acid\n'+
	'90\tSalmonella\tGatifloxacin\n'+
	'90\tSalmonella\tGentamicin\n'+
	'90\tSalmonella\tImipenem\n'+
	'90\tSalmonella\tLevofloxacin\n'+
	'0\tSalmonella\tLinezolid\n'+
	'90\tSalmonella\tMeropenem\n'+
	'0\tSalmonella\tMethicillin\n'+
	'0\tSalmonella\tMetronidazole\n'+
	'50\tSalmonella\tMinocycline\n'+
	'90\tSalmonella\tMoxifloxacin\n'+
	'0\tSalmonella\tNafcillin/Oxacillin\n'+
	'90\tSalmonella\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tSalmonella\tOfloxacin\n'+
	'90\tSalmonella\tPefloxacin\n'+
	'0\tSalmonella\tPenicillin G\n'+
	'0\tSalmonella\tPenicillin V\n'+
	'90\tSalmonella\tPiperacillin\n'+
	'90\tSalmonella\tPiperacillin-Tazobactam\n'+
	'0\tSalmonella\tQuinupristin-Dalfopristin\n'+
	'0\tSalmonella\tRifampin (not for Staph monotherapy)\n'+
	'50\tSalmonella\tTMP-SMX\n'+
	'0\tSalmonella\tTeicoplanin\n'+
	'0\tSalmonella\tTelavancin\n'+
	'0\tSalmonella\tTelithromycin\n'+
	'90\tSalmonella\tTicarcillin\n'+
	'90\tSalmonella\tTicarcillin-Clavulanate\n'+
	'90\tSalmonella\tTigecycline\n'+
	'90\tSalmonella\tTobramycin\n'+
	'50\tSalmonella\tTrimethoprim\n'+
	'0\tSalmonella\tVancomycin\n'+
	'50\tScedosporium apiospermum (Pseudoallescheria boydii)\tAmphotericin B\n'+
	'50\tScedosporium apiospermum (Pseudoallescheria boydii)\tCaspofungin\n'+
	'0\tScedosporium apiospermum (Pseudoallescheria boydii)\tFluconazole\n'+
	'0\tScedosporium apiospermum (Pseudoallescheria boydii)\tItraconazole\n'+
	'90\tScedosporium apiospermum (Pseudoallescheria boydii)\tVoriconazole\n'+
	'50\tScedosporium prolificans\tAmphotericin B\n'+
	'0\tScedosporium prolificans\tCaspofungin\n'+
	'0\tScedosporium prolificans\tFluconazole\n'+
	'0\tScedosporium prolificans\tItraconazole\n'+
	'50\tScedosporium prolificans\tVoriconazole\n'+
	'0\tSerratia\tAmoxicillin-Clavulanate\n'+
	'0\tSerratia\tAmpicillin-Sulbactam\n'+
	'0\tSerratia\tAmpicillin/Amoxicillin\n'+
	'90\tSerratia\tAztreonam\n'+
	'0\tSerratia\tCefaclor/Loracarbef\n'+
	'0\tSerratia\tCefadroxil\n'+
	'0\tSerratia\tCefazolin\n'+
	'90\tSerratia\tCefepime\n'+
	'50\tSerratia\tCefixime\n'+
	'90\tSerratia\tCefotaxime\n'+
	'90\tSerratia\tCefotetan\n'+
	'0\tSerratia\tCefoxitin\n'+
	'0\tSerratia\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tSerratia\tCefprozil\n'+
	'90\tSerratia\tCeftaroline\n'+
	'90\tSerratia\tCeftazidime\n'+
	'50\tSerratia\tCeftibuten\n'+
	'90\tSerratia\tCeftizoxime\n'+
	'90\tSerratia\tCeftobiprole\n'+
	'90\tSerratia\tCeftriaxone\n'+
	'0\tSerratia\tCefuroxime\n'+
	'0\tSerratia\tCephalexin\n'+
	'90\tSerratia\tCiprofloxacin\n'+
	'0\tSerratia\tCloxacillin/Dicloxacilin\n'+
	'90\tSerratia\tDoripenem\n'+
	'90\tSerratia\tErtapenem\n'+
	'90\tSerratia\tGatifloxacin\n'+
	'90\tSerratia\tImipenem\n'+
	'90\tSerratia\tLevofloxacin\n'+
	'90\tSerratia\tMeropenem\n'+
	'0\tSerratia\tMethicillin\n'+
	'90\tSerratia\tMoxifloxacin\n'+
	'0\tSerratia\tNafcillin/Oxacillin\n'+
	'90\tSerratia\tOfloxacin\n'+
	'90\tSerratia\tPefloxacin\n'+
	'0\tSerratia\tPenicillin G\n'+
	'0\tSerratia\tPenicillin V\n'+
	'0\tSerratia\tPiperacillin\n'+
	'90\tSerratia\tPiperacillin-Tazobactam\n'+
	'90\tSerratia\tTicarcillin\n'+
	'90\tSerratia\tTicarcillin-Clavulanate\n'+
	'90\tSerratia marcescens\tAmikacin\n'+
	'0\tSerratia marcescens\tAzithromycin\n'+
	'50\tSerratia marcescens\tChloramphenicol\n'+
	'0\tSerratia marcescens\tClarithromycin\n'+
	'0\tSerratia marcescens\tClindamycin\n'+
	'0\tSerratia marcescens\tColistimethate\n'+
	'0\tSerratia marcescens\tDaptomycin (non-pneumonia)\n'+
	'0\tSerratia marcescens\tDoxycycline\n'+
	'0\tSerratia marcescens\tErythromycin\n'+
	'50\tSerratia marcescens\tFosfomycin\n'+
	'0\tSerratia marcescens\tFusidic Acid\n'+
	'90\tSerratia marcescens\tGentamicin\n'+
	'0\tSerratia marcescens\tLinezolid\n'+
	'0\tSerratia marcescens\tMetronidazole\n'+
	'0\tSerratia marcescens\tMinocycline\n'+
	'0\tSerratia marcescens\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tSerratia marcescens\tRifampin (not for Staph monotherapy)\n'+
	'0\tSerratia marcescens\tTMP-SMX\n'+
	'0\tSerratia marcescens\tTeicoplanin\n'+
	'0\tSerratia marcescens\tTelavancin\n'+
	'0\tSerratia marcescens\tTelithromycin\n'+
	'50\tSerratia marcescens\tTigecycline\n'+
	'90\tSerratia marcescens\tTobramycin\n'+
	'0\tSerratia marcescens\tTrimethoprim\n'+
	'0\tSerratia marcescens\tVancomycin\n'+
	'90\tShigella\tAmikacin\n'+
	'90\tShigella\tAmoxicillin-Clavulanate\n'+
	'90\tShigella\tAmpicillin-Sulbactam\n'+
	'50\tShigella\tAmpicillin/Amoxicillin\n'+
	'0\tShigella\tAzithromycin\n'+
	'90\tShigella\tAztreonam\n'+
	'0\tShigella\tCefadroxil\n'+
	'90\tShigella\tCefepime\n'+
	'90\tShigella\tCefixime\n'+
	'90\tShigella\tCefotaxime\n'+
	'90\tShigella\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tShigella\tCeftazidime\n'+
	'90\tShigella\tCeftibuten\n'+
	'90\tShigella\tCeftizoxime\n'+
	'90\tShigella\tCeftriaxone\n'+
	'0\tShigella\tCephalexin\n'+
	'0\tShigella\tChloramphenicol\n'+
	'90\tShigella\tCiprofloxacin\n'+
	'0\tShigella\tClarithromycin\n'+
	'0\tShigella\tClindamycin\n'+
	'0\tShigella\tCloxacillin/Dicloxacilin\n'+
	'0\tShigella\tColistimethate\n'+
	'0\tShigella\tDaptomycin (non-pneumonia)\n'+
	'90\tShigella\tDoripenem\n'+
	'0\tShigella\tDoxycycline\n'+
	'90\tShigella\tErtapenem\n'+
	'0\tShigella\tErythromycin\n'+
	'50\tShigella\tFosfomycin\n'+
	'0\tShigella\tFusidic Acid\n'+
	'90\tShigella\tGatifloxacin\n'+
	'90\tShigella\tGentamicin\n'+
	'90\tShigella\tImipenem\n'+
	'90\tShigella\tLevofloxacin\n'+
	'0\tShigella\tLinezolid\n'+
	'90\tShigella\tMeropenem\n'+
	'0\tShigella\tMethicillin\n'+
	'0\tShigella\tMetronidazole\n'+
	'0\tShigella\tMinocycline\n'+
	'90\tShigella\tMoxifloxacin\n'+
	'0\tShigella\tNafcillin/Oxacillin\n'+
	'0\tShigella\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tShigella\tOfloxacin\n'+
	'90\tShigella\tPefloxacin\n'+
	'0\tShigella\tPenicillin G\n'+
	'0\tShigella\tPenicillin V\n'+
	'90\tShigella\tPiperacillin\n'+
	'90\tShigella\tPiperacillin-Tazobactam\n'+
	'0\tShigella\tRifampin (not for Staph monotherapy)\n'+
	'50\tShigella\tTMP-SMX\n'+
	'0\tShigella\tTeicoplanin\n'+
	'0\tShigella\tTelavancin\n'+
	'0\tShigella\tTelithromycin\n'+
	'90\tShigella\tTicarcillin\n'+
	'90\tShigella\tTicarcillin-Clavulanate\n'+
	'90\tShigella\tTigecycline\n'+
	'90\tShigella\tTobramycin\n'+
	'0\tShigella\tTrimethoprim\n'+
	'0\tShigella\tVancomycin\n'+
	'90\tSporothrix schenckii\tAmphotericin B\n'+
	'0\tSporothrix schenckii\tCaspofungin\n'+
	'0\tSporothrix schenckii\tFluconazole\n'+
	'80\tSporothrix schenckii\tItraconazole\n'+
	'0\tSporothrix schenckii\tVoriconazole\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tAmikacin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tAmoxicillin-Clavulanate\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tAmpicillin-Sulbactam\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tAmpicillin/Amoxicillin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tAzithromycin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tAztreonam\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefaclor/Loracarbef\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefadroxil\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefazolin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefepime\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefixime\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefotaxime\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefotetan\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefoxitin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefprozil\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tCeftaroline\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCeftazidime\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCeftibuten\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCeftizoxime\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tCeftobiprole\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCeftriaxone\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCefuroxime\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCephalexin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tChloramphenicol\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tCiprofloxacin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tClarithromycin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tClindamycin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tCloxacillin/Dicloxacilin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tColistimethate\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tDaptomycin (non-pneumonia)\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tDoripenem\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tDoxycycline\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tErtapenem\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tErythromycin\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tFusidic Acid\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tGatifloxacin\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tGemifloxacin\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tGentamicin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tImipenem\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tLevofloxacin\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tLinezolid\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tMeropenem\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tMethicillin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tMetronidazole\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tMinocycline\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tMoxifloxacin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tNafcillin/Oxacillin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tPenicillin G\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tPenicillin V\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tPiperacillin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tPiperacillin-Tazobactam\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tQuinupristin-Dalfopristin\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tRifampin (not for Staph monotherapy)\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tTMP-SMX\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tTeicoplanin\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tTelavancin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tTelithromycin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tTicarcillin\n'+
	'0\tStaphylococcus aureus (CA-MRSA)\tTicarcillin-Clavulanate\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tTigecycline\n'+
	'50\tStaphylococcus aureus (CA-MRSA)\tTobramycin\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tTrimethoprim\n'+
	'90\tStaphylococcus aureus (CA-MRSA)\tVancomycin\n'+
	'0\tStaphylococcus aureus (MRSA)\tAmoxicillin-Clavulanate\n'+
	'0\tStaphylococcus aureus (MRSA)\tAmpicillin-Sulbactam\n'+
	'0\tStaphylococcus aureus (MRSA)\tAmpicillin/Amoxicillin\n'+
	'50\tStaphylococcus aureus (MRSA)\tAzithromycin\n'+
	'0\tStaphylococcus aureus (MRSA)\tAztreonam\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefaclor/Loracarbef\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefadroxil\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefazolin\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefepime\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefixime\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefotaxime\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefotetan\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefoxitin\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefprozil\n'+
	'90\tStaphylococcus aureus (MRSA)\tCeftaroline\n'+
	'0\tStaphylococcus aureus (MRSA)\tCeftazidime\n'+
	'0\tStaphylococcus aureus (MRSA)\tCeftibuten\n'+
	'0\tStaphylococcus aureus (MRSA)\tCeftizoxime\n'+
	'90\tStaphylococcus aureus (MRSA)\tCeftobiprole\n'+
	'0\tStaphylococcus aureus (MRSA)\tCeftriaxone\n'+
	'0\tStaphylococcus aureus (MRSA)\tCefuroxime\n'+
	'0\tStaphylococcus aureus (MRSA)\tCephalexin\n'+
	'0\tStaphylococcus aureus (MRSA)\tCiprofloxacin\n'+
	'50\tStaphylococcus aureus (MRSA)\tClarithromycin\n'+
	'50\tStaphylococcus aureus (MRSA)\tClindamycin\n'+
	'0\tStaphylococcus aureus (MRSA)\tCloxacillin/Dicloxacilin\n'+
	'0\tStaphylococcus aureus (MRSA)\tColistimethate\n'+
	'90\tStaphylococcus aureus (MRSA)\tDaptomycin (non-pneumonia)\n'+
	'0\tStaphylococcus aureus (MRSA)\tDoripenem\n'+
	'90\tStaphylococcus aureus (MRSA)\tDoxycycline\n'+
	'0\tStaphylococcus aureus (MRSA)\tErtapenem\n'+
	'50\tStaphylococcus aureus (MRSA)\tErythromycin\n'+
	'90\tStaphylococcus aureus (MRSA)\tFusidic Acid\n'+
	'50\tStaphylococcus aureus (MRSA)\tGatifloxacin\n'+
	'50\tStaphylococcus aureus (MRSA)\tGemifloxacin\n'+
	'0\tStaphylococcus aureus (MRSA)\tImipenem\n'+
	'0\tStaphylococcus aureus (MRSA)\tLevofloxacin\n'+
	'90\tStaphylococcus aureus (MRSA)\tLinezolid\n'+
	'0\tStaphylococcus aureus (MRSA)\tMeropenem\n'+
	'0\tStaphylococcus aureus (MRSA)\tMethicillin\n'+
	'0\tStaphylococcus aureus (MRSA)\tMetronidazole\n'+
	'90\tStaphylococcus aureus (MRSA)\tMinocycline\n'+
	'50\tStaphylococcus aureus (MRSA)\tMoxifloxacin\n'+
	'0\tStaphylococcus aureus (MRSA)\tNafcillin/Oxacillin\n'+
	'90\tStaphylococcus aureus (MRSA)\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tStaphylococcus aureus (MRSA)\tOfloxacin\n'+
	'0\tStaphylococcus aureus (MRSA)\tPefloxacin\n'+
	'0\tStaphylococcus aureus (MRSA)\tPenicillin G\n'+
	'0\tStaphylococcus aureus (MRSA)\tPenicillin V\n'+
	'0\tStaphylococcus aureus (MRSA)\tPiperacillin\n'+
	'0\tStaphylococcus aureus (MRSA)\tPiperacillin-Tazobactam\n'+
	'90\tStaphylococcus aureus (MRSA)\tQuinupristin-Dalfopristin\n'+
	'90\tStaphylococcus aureus (MRSA)\tRifampin (not for Staph monotherapy)\n'+
	'90\tStaphylococcus aureus (MRSA)\tTMP-SMX\n'+
	'90\tStaphylococcus aureus (MRSA)\tTeicoplanin\n'+
	'90\tStaphylococcus aureus (MRSA)\tTelavancin\n'+
	'50\tStaphylococcus aureus (MRSA)\tTelithromycin\n'+
	'0\tStaphylococcus aureus (MRSA)\tTicarcillin\n'+
	'0\tStaphylococcus aureus (MRSA)\tTicarcillin-Clavulanate\n'+
	'90\tStaphylococcus aureus (MRSA)\tTigecycline\n'+
	'90\tStaphylococcus aureus (MRSA)\tTrimethoprim\n'+
	'90\tStaphylococcus aureus (MRSA)\tVancomycin\n'+
	'0\tStaphylococcus aureus (MSSA)\tAmikacin\n'+
	'90\tStaphylococcus aureus (MSSA)\tAmoxicillin-Clavulanate\n'+
	'90\tStaphylococcus aureus (MSSA)\tAmpicillin-Sulbactam\n'+
	'0\tStaphylococcus aureus (MSSA)\tAmpicillin/Amoxicillin\n'+
	'0\tStaphylococcus aureus (MSSA)\tAzithromycin\n'+
	'0\tStaphylococcus aureus (MSSA)\tAztreonam\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefaclor/Loracarbef\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefadroxil\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefazolin\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefepime\n'+
	'0\tStaphylococcus aureus (MSSA)\tCefixime\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefotaxime\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefotetan\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefoxitin\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefprozil\n'+
	'90\tStaphylococcus aureus (MSSA)\tCeftaroline\n'+
	'50\tStaphylococcus aureus (MSSA)\tCeftazidime\n'+
	'0\tStaphylococcus aureus (MSSA)\tCeftibuten\n'+
	'90\tStaphylococcus aureus (MSSA)\tCeftizoxime\n'+
	'90\tStaphylococcus aureus (MSSA)\tCeftobiprole\n'+
	'90\tStaphylococcus aureus (MSSA)\tCeftriaxone\n'+
	'90\tStaphylococcus aureus (MSSA)\tCefuroxime\n'+
	'90\tStaphylococcus aureus (MSSA)\tCephalexin\n'+
	'0\tStaphylococcus aureus (MSSA)\tChloramphenicol\n'+
	'90\tStaphylococcus aureus (MSSA)\tCiprofloxacin\n'+
	'0\tStaphylococcus aureus (MSSA)\tClarithromycin\n'+
	'0\tStaphylococcus aureus (MSSA)\tClindamycin\n'+
	'90\tStaphylococcus aureus (MSSA)\tCloxacillin/Dicloxacilin\n'+
	'0\tStaphylococcus aureus (MSSA)\tColistimethate\n'+
	'90\tStaphylococcus aureus (MSSA)\tDaptomycin (non-pneumonia)\n'+
	'90\tStaphylococcus aureus (MSSA)\tDoripenem\n'+
	'50\tStaphylococcus aureus (MSSA)\tDoxycycline\n'+
	'90\tStaphylococcus aureus (MSSA)\tErtapenem\n'+
	'0\tStaphylococcus aureus (MSSA)\tErythromycin\n'+
	'90\tStaphylococcus aureus (MSSA)\tFusidic Acid\n'+
	'90\tStaphylococcus aureus (MSSA)\tGatifloxacin\n'+
	'90\tStaphylococcus aureus (MSSA)\tGemifloxacin\n'+
	'0\tStaphylococcus aureus (MSSA)\tGentamicin\n'+
	'90\tStaphylococcus aureus (MSSA)\tImipenem\n'+
	'90\tStaphylococcus aureus (MSSA)\tLevofloxacin\n'+
	'90\tStaphylococcus aureus (MSSA)\tLinezolid\n'+
	'90\tStaphylococcus aureus (MSSA)\tMeropenem\n'+
	'90\tStaphylococcus aureus (MSSA)\tMethicillin\n'+
	'0\tStaphylococcus aureus (MSSA)\tMetronidazole\n'+
	'50\tStaphylococcus aureus (MSSA)\tMinocycline\n'+
	'90\tStaphylococcus aureus (MSSA)\tMoxifloxacin\n'+
	'90\tStaphylococcus aureus (MSSA)\tNafcillin/Oxacillin\n'+
	'90\tStaphylococcus aureus (MSSA)\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tStaphylococcus aureus (MSSA)\tOfloxacin\n'+
	'90\tStaphylococcus aureus (MSSA)\tPefloxacin\n'+
	'0\tStaphylococcus aureus (MSSA)\tPenicillin G\n'+
	'0\tStaphylococcus aureus (MSSA)\tPenicillin V\n'+
	'0\tStaphylococcus aureus (MSSA)\tPiperacillin\n'+
	'90\tStaphylococcus aureus (MSSA)\tPiperacillin-Tazobactam\n'+
	'90\tStaphylococcus aureus (MSSA)\tQuinupristin-Dalfopristin\n'+
	'90\tStaphylococcus aureus (MSSA)\tRifampin (not for Staph monotherapy)\n'+
	'90\tStaphylococcus aureus (MSSA)\tTMP-SMX\n'+
	'90\tStaphylococcus aureus (MSSA)\tTeicoplanin\n'+
	'90\tStaphylococcus aureus (MSSA)\tTelavancin\n'+
	'0\tStaphylococcus aureus (MSSA)\tTelithromycin\n'+
	'0\tStaphylococcus aureus (MSSA)\tTicarcillin\n'+
	'90\tStaphylococcus aureus (MSSA)\tTicarcillin-Clavulanate\n'+
	'90\tStaphylococcus aureus (MSSA)\tTigecycline\n'+
	'0\tStaphylococcus aureus (MSSA)\tTobramycin\n'+
	'50\tStaphylococcus aureus (MSSA)\tTrimethoprim\n'+
	'90\tStaphylococcus aureus (MSSA)\tVancomycin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAmikacin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAmoxicillin-Clavulanate\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAmpicillin-Sulbactam\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAmpicillin/Amoxicillin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAzithromycin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tAztreonam\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefaclor/Loracarbef\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefadroxil\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefazolin\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefepime\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tCefixime\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefotaxime\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefotetan\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefoxitin\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefprozil\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftaroline\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftazidime\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftibuten\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftizoxime\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftobiprole\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCeftriaxone\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCefuroxime\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tCephalexin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tChloramphenicol\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tCiprofloxacin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tClarithromycin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tClindamycin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tCloxacillin/Dicloxacilin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tColistimethate\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tDaptomycin (non-pneumonia)\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tDoripenem\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tDoxycycline\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tErtapenem\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tErythromycin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tFusidic Acid\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tGatifloxacin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tGemifloxacin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tGentamicin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tImipenem\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tLevofloxacin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tLinezolid\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tMeropenem\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tMethicillin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tMetronidazole\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tMinocycline\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tMoxifloxacin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tNafcillin/Oxacillin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tOfloxacin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tPefloxacin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin G\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin V\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tPiperacillin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tPiperacillin-Tazobactam\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tQuinupristin-Dalfopristin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tRifampin (not for Staph monotherapy)\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tTMP-SMX\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tTeicoplanin\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tTelavancin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tTelithromycin\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tTicarcillin\n'+
	'50\tStaphylococcus, Coagulase Negative (epidermidis)\tTicarcillin-Clavulanate\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tTigecycline\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tTobramycin\n'+
	'0\tStaphylococcus, Coagulase Negative (epidermidis)\tTrimethoprim\n'+
	'90\tStaphylococcus, Coagulase Negative (epidermidis)\tVancomycin\n'+
	'90\tStenotrophomonas maltophilia\tAmikacin\n'+
	'0\tStenotrophomonas maltophilia\tAmoxicillin-Clavulanate\n'+
	'0\tStenotrophomonas maltophilia\tAmpicillin-Sulbactam\n'+
	'0\tStenotrophomonas maltophilia\tAmpicillin/Amoxicillin\n'+
	'0\tStenotrophomonas maltophilia\tAzithromycin\n'+
	'0\tStenotrophomonas maltophilia\tAztreonam\n'+
	'0\tStenotrophomonas maltophilia\tCefaclor/Loracarbef\n'+
	'0\tStenotrophomonas maltophilia\tCefadroxil\n'+
	'0\tStenotrophomonas maltophilia\tCefazolin\n'+
	'0\tStenotrophomonas maltophilia\tCefepime\n'+
	'0\tStenotrophomonas maltophilia\tCefixime\n'+
	'0\tStenotrophomonas maltophilia\tCefotaxime\n'+
	'0\tStenotrophomonas maltophilia\tCefotetan\n'+
	'0\tStenotrophomonas maltophilia\tCefoxitin\n'+
	'0\tStenotrophomonas maltophilia\tCefprozil\n'+
	'0\tStenotrophomonas maltophilia\tCeftaroline\n'+
	'50\tStenotrophomonas maltophilia\tCeftazidime\n'+
	'0\tStenotrophomonas maltophilia\tCeftibuten\n'+
	'0\tStenotrophomonas maltophilia\tCeftizoxime\n'+
	'0\tStenotrophomonas maltophilia\tCeftobiprole\n'+
	'0\tStenotrophomonas maltophilia\tCeftriaxone\n'+
	'0\tStenotrophomonas maltophilia\tCefuroxime\n'+
	'0\tStenotrophomonas maltophilia\tCephalexin\n'+
	'90\tStenotrophomonas maltophilia\tChloramphenicol\n'+
	'0\tStenotrophomonas maltophilia\tCiprofloxacin\n'+
	'0\tStenotrophomonas maltophilia\tClarithromycin\n'+
	'0\tStenotrophomonas maltophilia\tClindamycin\n'+
	'0\tStenotrophomonas maltophilia\tCloxacillin/Dicloxacilin\n'+
	'0\tStenotrophomonas maltophilia\tDaptomycin (non-pneumonia)\n'+
	'0\tStenotrophomonas maltophilia\tDoripenem\n'+
	'0\tStenotrophomonas maltophilia\tDoxycycline\n'+
	'0\tStenotrophomonas maltophilia\tErtapenem\n'+
	'0\tStenotrophomonas maltophilia\tErythromycin\n'+
	'0\tStenotrophomonas maltophilia\tFusidic Acid\n'+
	'90\tStenotrophomonas maltophilia\tGentamicin\n'+
	'0\tStenotrophomonas maltophilia\tImipenem\n'+
	'50\tStenotrophomonas maltophilia\tLevofloxacin\n'+
	'0\tStenotrophomonas maltophilia\tLinezolid\n'+
	'0\tStenotrophomonas maltophilia\tMeropenem\n'+
	'0\tStenotrophomonas maltophilia\tMethicillin\n'+
	'0\tStenotrophomonas maltophilia\tMetronidazole\n'+
	'0\tStenotrophomonas maltophilia\tMinocycline\n'+
	'90\tStenotrophomonas maltophilia\tMoxifloxacin\n'+
	'0\tStenotrophomonas maltophilia\tNafcillin/Oxacillin\n'+
	'0\tStenotrophomonas maltophilia\tOfloxacin\n'+
	'0\tStenotrophomonas maltophilia\tPefloxacin\n'+
	'0\tStenotrophomonas maltophilia\tPenicillin G\n'+
	'0\tStenotrophomonas maltophilia\tPenicillin V\n'+
	'50\tStenotrophomonas maltophilia\tPiperacillin\n'+
	'50\tStenotrophomonas maltophilia\tPiperacillin-Tazobactam\n'+
	'90\tStenotrophomonas maltophilia\tTMP-SMX\n'+
	'0\tStenotrophomonas maltophilia\tTelithromycin\n'+
	'50\tStenotrophomonas maltophilia\tTicarcillin-Clavulanate\n'+
	'90\tStenotrophomonas maltophilia\tTobramycin\n'+
	'0\tStreptococcus Group A,B,C,G\tAmikacin\n'+
	'90\tStreptococcus Group A,B,C,G\tAmoxicillin-Clavulanate\n'+
	'90\tStreptococcus Group A,B,C,G\tAmpicillin-Sulbactam\n'+
	'90\tStreptococcus Group A,B,C,G\tAmpicillin/Amoxicillin\n'+
	'50\tStreptococcus Group A,B,C,G\tAzithromycin\n'+
	'0\tStreptococcus Group A,B,C,G\tAztreonam\n'+
	'90\tStreptococcus Group A,B,C,G\tCefaclor/Loracarbef\n'+
	'90\tStreptococcus Group A,B,C,G\tCefadroxil\n'+
	'90\tStreptococcus Group A,B,C,G\tCefazolin\n'+
	'90\tStreptococcus Group A,B,C,G\tCefepime\n'+
	'90\tStreptococcus Group A,B,C,G\tCefixime\n'+
	'90\tStreptococcus Group A,B,C,G\tCefotaxime\n'+
	'90\tStreptococcus Group A,B,C,G\tCefotetan\n'+
	'90\tStreptococcus Group A,B,C,G\tCefoxitin\n'+
	'90\tStreptococcus Group A,B,C,G\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tStreptococcus Group A,B,C,G\tCefprozil\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftaroline\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftazidime\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftibuten\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftizoxime\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftobiprole\n'+
	'90\tStreptococcus Group A,B,C,G\tCeftriaxone\n'+
	'90\tStreptococcus Group A,B,C,G\tCefuroxime\n'+
	'90\tStreptococcus Group A,B,C,G\tCephalexin\n'+
	'90\tStreptococcus Group A,B,C,G\tChloramphenicol\n'+
	'50\tStreptococcus Group A,B,C,G\tCiprofloxacin\n'+
	'50\tStreptococcus Group A,B,C,G\tClarithromycin\n'+
	'90\tStreptococcus Group A,B,C,G\tClindamycin\n'+
	'90\tStreptococcus Group A,B,C,G\tCloxacillin/Dicloxacilin\n'+
	'0\tStreptococcus Group A,B,C,G\tColistimethate\n'+
	'90\tStreptococcus Group A,B,C,G\tDaptomycin (non-pneumonia)\n'+
	'90\tStreptococcus Group A,B,C,G\tDoripenem\n'+
	'50\tStreptococcus Group A,B,C,G\tDoxycycline\n'+
	'90\tStreptococcus Group A,B,C,G\tErtapenem\n'+
	'50\tStreptococcus Group A,B,C,G\tErythromycin\n'+
	'50\tStreptococcus Group A,B,C,G\tFusidic Acid\n'+
	'90\tStreptococcus Group A,B,C,G\tGatifloxacin\n'+
	'90\tStreptococcus Group A,B,C,G\tGemifloxacin\n'+
	'0\tStreptococcus Group A,B,C,G\tGentamicin\n'+
	'90\tStreptococcus Group A,B,C,G\tImipenem\n'+
	'90\tStreptococcus Group A,B,C,G\tLevofloxacin\n'+
	'90\tStreptococcus Group A,B,C,G\tLinezolid\n'+
	'90\tStreptococcus Group A,B,C,G\tMeropenem\n'+
	'90\tStreptococcus Group A,B,C,G\tMethicillin\n'+
	'0\tStreptococcus Group A,B,C,G\tMetronidazole\n'+
	'90\tStreptococcus Group A,B,C,G\tMinocycline\n'+
	'90\tStreptococcus Group A,B,C,G\tMoxifloxacin\n'+
	'90\tStreptococcus Group A,B,C,G\tNafcillin/Oxacillin\n'+
	'90\tStreptococcus Group A,B,C,G\tNitrofurantoin (uncomplicated UTI)\n'+
	'50\tStreptococcus Group A,B,C,G\tOfloxacin\n'+
	'0\tStreptococcus Group A,B,C,G\tPefloxacin\n'+
	'90\tStreptococcus Group A,B,C,G\tPenicillin G\n'+
	'90\tStreptococcus Group A,B,C,G\tPenicillin V\n'+
	'90\tStreptococcus Group A,B,C,G\tPiperacillin\n'+
	'90\tStreptococcus Group A,B,C,G\tPiperacillin-Tazobactam\n'+
	'90\tStreptococcus Group A,B,C,G\tQuinupristin-Dalfopristin\n'+
	'90\tStreptococcus Group A,B,C,G\tRifampin (not for Staph monotherapy)\n'+
	'90\tStreptococcus Group A,B,C,G\tTeicoplanin\n'+
	'90\tStreptococcus Group A,B,C,G\tTelavancin\n'+
	'90\tStreptococcus Group A,B,C,G\tTelithromycin\n'+
	'90\tStreptococcus Group A,B,C,G\tTicarcillin\n'+
	'90\tStreptococcus Group A,B,C,G\tTicarcillin-Clavulanate\n'+
	'90\tStreptococcus Group A,B,C,G\tTigecycline\n'+
	'0\tStreptococcus Group A,B,C,G\tTobramycin\n'+
	'90\tStreptococcus Group A,B,C,G\tTrimethoprim\n'+
	'90\tStreptococcus Group A,B,C,G\tVancomycin\n'+
	'90\tStreptococcus milleri\tAmoxicillin-Clavulanate\n'+
	'90\tStreptococcus milleri\tAmpicillin-Sulbactam\n'+
	'90\tStreptococcus milleri\tAmpicillin/Amoxicillin\n'+
	'0\tStreptococcus milleri\tAztreonam\n'+
	'0\tStreptococcus milleri\tCiprofloxacin\n'+
	'90\tStreptococcus milleri\tCloxacillin/Dicloxacilin\n'+
	'90\tStreptococcus milleri\tDoripenem\n'+
	'90\tStreptococcus milleri\tErtapenem\n'+
	'90\tStreptococcus milleri\tGatifloxacin\n'+
	'90\tStreptococcus milleri\tGemifloxacin\n'+
	'90\tStreptococcus milleri\tImipenem\n'+
	'90\tStreptococcus milleri\tLevofloxacin\n'+
	'90\tStreptococcus milleri\tMeropenem\n'+
	'90\tStreptococcus milleri\tMethicillin\n'+
	'90\tStreptococcus milleri\tMoxifloxacin\n'+
	'90\tStreptococcus milleri\tNafcillin/Oxacillin\n'+
	'0\tStreptococcus milleri\tOfloxacin\n'+
	'90\tStreptococcus milleri\tPenicillin G\n'+
	'90\tStreptococcus milleri\tPenicillin V\n'+
	'90\tStreptococcus milleri\tPiperacillin\n'+
	'90\tStreptococcus milleri\tPiperacillin-Tazobactam\n'+
	'90\tStreptococcus milleri\tTicarcillin\n'+
	'90\tStreptococcus milleri\tTicarcillin-Clavulanate\n'+
	'0\tStreptococcus pneumoniae\tAmikacin\n'+
	'90\tStreptococcus pneumoniae\tAmoxicillin-Clavulanate\n'+
	'90\tStreptococcus pneumoniae\tAmpicillin-Sulbactam\n'+
	'90\tStreptococcus pneumoniae\tAmpicillin/Amoxicillin\n'+
	'90\tStreptococcus pneumoniae\tAzithromycin\n'+
	'0\tStreptococcus pneumoniae\tAztreonam\n'+
	'90\tStreptococcus pneumoniae\tCefaclor/Loracarbef\n'+
	'90\tStreptococcus pneumoniae\tCefadroxil\n'+
	'90\tStreptococcus pneumoniae\tCefazolin\n'+
	'90\tStreptococcus pneumoniae\tCefepime\n'+
	'90\tStreptococcus pneumoniae\tCefixime\n'+
	'90\tStreptococcus pneumoniae\tCefotaxime\n'+
	'90\tStreptococcus pneumoniae\tCefotetan\n'+
	'90\tStreptococcus pneumoniae\tCefoxitin\n'+
	'90\tStreptococcus pneumoniae\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'90\tStreptococcus pneumoniae\tCefprozil\n'+
	'90\tStreptococcus pneumoniae\tCeftaroline\n'+
	'90\tStreptococcus pneumoniae\tCeftazidime\n'+
	'50\tStreptococcus pneumoniae\tCeftibuten\n'+
	'90\tStreptococcus pneumoniae\tCeftizoxime\n'+
	'90\tStreptococcus pneumoniae\tCeftobiprole\n'+
	'90\tStreptococcus pneumoniae\tCeftriaxone\n'+
	'90\tStreptococcus pneumoniae\tCefuroxime\n'+
	'90\tStreptococcus pneumoniae\tCephalexin\n'+
	'90\tStreptococcus pneumoniae\tChloramphenicol\n'+
	'50\tStreptococcus pneumoniae\tCiprofloxacin\n'+
	'90\tStreptococcus pneumoniae\tClarithromycin\n'+
	'90\tStreptococcus pneumoniae\tClindamycin\n'+
	'90\tStreptococcus pneumoniae\tCloxacillin/Dicloxacilin\n'+
	'0\tStreptococcus pneumoniae\tColistimethate\n'+
	'90\tStreptococcus pneumoniae\tDaptomycin (non-pneumonia)\n'+
	'90\tStreptococcus pneumoniae\tDoripenem\n'+
	'90\tStreptococcus pneumoniae\tDoxycycline\n'+
	'90\tStreptococcus pneumoniae\tErtapenem\n'+
	'90\tStreptococcus pneumoniae\tErythromycin\n'+
	'50\tStreptococcus pneumoniae\tFusidic Acid\n'+
	'90\tStreptococcus pneumoniae\tGatifloxacin\n'+
	'90\tStreptococcus pneumoniae\tGemifloxacin\n'+
	'0\tStreptococcus pneumoniae\tGentamicin\n'+
	'90\tStreptococcus pneumoniae\tImipenem\n'+
	'90\tStreptococcus pneumoniae\tLevofloxacin\n'+
	'90\tStreptococcus pneumoniae\tLinezolid\n'+
	'90\tStreptococcus pneumoniae\tMeropenem\n'+
	'90\tStreptococcus pneumoniae\tMethicillin\n'+
	'0\tStreptococcus pneumoniae\tMetronidazole\n'+
	'90\tStreptococcus pneumoniae\tMinocycline\n'+
	'90\tStreptococcus pneumoniae\tMoxifloxacin\n'+
	'90\tStreptococcus pneumoniae\tNafcillin/Oxacillin\n'+
	'90\tStreptococcus pneumoniae\tNitrofurantoin (uncomplicated UTI)\n'+
	'50\tStreptococcus pneumoniae\tOfloxacin\n'+
	'0\tStreptococcus pneumoniae\tPefloxacin\n'+
	'90\tStreptococcus pneumoniae\tPenicillin G\n'+
	'90\tStreptococcus pneumoniae\tPenicillin V\n'+
	'90\tStreptococcus pneumoniae\tPiperacillin\n'+
	'90\tStreptococcus pneumoniae\tPiperacillin-Tazobactam\n'+
	'90\tStreptococcus pneumoniae\tQuinupristin-Dalfopristin\n'+
	'90\tStreptococcus pneumoniae\tRifampin (not for Staph monotherapy)\n'+
	'90\tStreptococcus pneumoniae\tTMP-SMX\n'+
	'90\tStreptococcus pneumoniae\tTeicoplanin\n'+
	'90\tStreptococcus pneumoniae\tTelavancin\n'+
	'90\tStreptococcus pneumoniae\tTelithromycin\n'+
	'90\tStreptococcus pneumoniae\tTicarcillin\n'+
	'90\tStreptococcus pneumoniae\tTicarcillin-Clavulanate\n'+
	'90\tStreptococcus pneumoniae\tTigecycline\n'+
	'0\tStreptococcus pneumoniae\tTobramycin\n'+
	'50\tStreptococcus pneumoniae\tTrimethoprim\n'+
	'90\tStreptococcus pneumoniae\tVancomycin\n'+
	'90\tStreptococcus viridans Group\tAmikacin\n'+
	'50\tStreptococcus viridans Group\tAmoxicillin-Clavulanate\n'+
	'50\tStreptococcus viridans Group\tAmpicillin-Sulbactam\n'+
	'50\tStreptococcus viridans Group\tAmpicillin/Amoxicillin\n'+
	'0\tStreptococcus viridans Group\tAzithromycin\n'+
	'0\tStreptococcus viridans Group\tAztreonam\n'+
	'90\tStreptococcus viridans Group\tCefaclor/Loracarbef\n'+
	'90\tStreptococcus viridans Group\tCefadroxil\n'+
	'90\tStreptococcus viridans Group\tCefazolin\n'+
	'90\tStreptococcus viridans Group\tCefepime\n'+
	'90\tStreptococcus viridans Group\tCefixime\n'+
	'90\tStreptococcus viridans Group\tCefotaxime\n'+
	'90\tStreptococcus viridans Group\tCefotetan\n'+
	'90\tStreptococcus viridans Group\tCefoxitin\n'+
	'90\tStreptococcus viridans Group\tCefpodoxime/Cefdinir/Cefditoren\n'+
	'0\tStreptococcus viridans Group\tCefprozil\n'+
	'90\tStreptococcus viridans Group\tCeftaroline\n'+
	'50\tStreptococcus viridans Group\tCeftazidime\n'+
	'0\tStreptococcus viridans Group\tCeftibuten\n'+
	'90\tStreptococcus viridans Group\tCeftizoxime\n'+
	'90\tStreptococcus viridans Group\tCeftobiprole\n'+
	'90\tStreptococcus viridans Group\tCeftriaxone\n'+
	'90\tStreptococcus viridans Group\tCefuroxime\n'+
	'90\tStreptococcus viridans Group\tCephalexin\n'+
	'50\tStreptococcus viridans Group\tChloramphenicol\n'+
	'0\tStreptococcus viridans Group\tCiprofloxacin\n'+
	'0\tStreptococcus viridans Group\tClarithromycin\n'+
	'0\tStreptococcus viridans Group\tClindamycin\n'+
	'50\tStreptococcus viridans Group\tCloxacillin/Dicloxacilin\n'+
	'0\tStreptococcus viridans Group\tColistimethate\n'+
	'90\tStreptococcus viridans Group\tDaptomycin (non-pneumonia)\n'+
	'90\tStreptococcus viridans Group\tDoripenem\n'+
	'0\tStreptococcus viridans Group\tDoxycycline\n'+
	'90\tStreptococcus viridans Group\tErtapenem\n'+
	'0\tStreptococcus viridans Group\tErythromycin\n'+
	'90\tStreptococcus viridans Group\tFosfomycin\n'+
	'90\tStreptococcus viridans Group\tFusidic Acid\n'+
	'90\tStreptococcus viridans Group\tGatifloxacin\n'+
	'90\tStreptococcus viridans Group\tGemifloxacin\n'+
	'90\tStreptococcus viridans Group\tGentamicin\n'+
	'90\tStreptococcus viridans Group\tImipenem\n'+
	'90\tStreptococcus viridans Group\tLevofloxacin\n'+
	'90\tStreptococcus viridans Group\tLinezolid\n'+
	'90\tStreptococcus viridans Group\tMeropenem\n'+
	'50\tStreptococcus viridans Group\tMethicillin\n'+
	'0\tStreptococcus viridans Group\tMetronidazole\n'+
	'0\tStreptococcus viridans Group\tMinocycline\n'+
	'90\tStreptococcus viridans Group\tMoxifloxacin\n'+
	'50\tStreptococcus viridans Group\tNafcillin/Oxacillin\n'+
	'90\tStreptococcus viridans Group\tNitrofurantoin (uncomplicated UTI)\n'+
	'0\tStreptococcus viridans Group\tOfloxacin\n'+
	'50\tStreptococcus viridans Group\tPenicillin G\n'+
	'50\tStreptococcus viridans Group\tPenicillin V\n'+
	'50\tStreptococcus viridans Group\tPiperacillin\n'+
	'50\tStreptococcus viridans Group\tPiperacillin-Tazobactam\n'+
	'0\tStreptococcus viridans Group\tQuinupristin-Dalfopristin\n'+
	'50\tStreptococcus viridans Group\tRifampin (not for Staph monotherapy)\n'+
	'90\tStreptococcus viridans Group\tTMP-SMX\n'+
	'90\tStreptococcus viridans Group\tTeicoplanin\n'+
	'90\tStreptococcus viridans Group\tTelavancin\n'+
	'50\tStreptococcus viridans Group\tTelithromycin\n'+
	'50\tStreptococcus viridans Group\tTicarcillin\n'+
	'50\tStreptococcus viridans Group\tTicarcillin-Clavulanate\n'+
	'90\tStreptococcus viridans Group\tTigecycline\n'+
	'90\tStreptococcus viridans Group\tTobramycin\n'+
	'90\tStreptococcus viridans Group\tTrimethoprim\n'+
	'90\tStreptococcus viridans Group\tVancomycin\n'+
	'75\tTrichosporon\tAmphotericin B\n'+
	'0\tTrichosporon\tCaspofungin\n'+
	'50\tTrichosporon\tFluconazole\n'+
	'75\tTrichosporon\tItraconazole\n'+
	'80\tTrichosporon\tVoriconazole\n'+
	'0\tVibrio vulnificus\tAmikacin\n'+
	'90\tVibrio vulnificus\tAzithromycin\n'+
	'90\tVibrio vulnificus\tChloramphenicol\n'+
	'90\tVibrio vulnificus\tClarithromycin\n'+
	'50\tVibrio vulnificus\tClindamycin\n'+
	'90\tVibrio vulnificus\tDoxycycline\n'+
	'90\tVibrio vulnificus\tErythromycin\n'+
	'0\tVibrio vulnificus\tFusidic Acid\n'+
	'0\tVibrio vulnificus\tGentamicin\n'+
	'90\tVibrio vulnificus\tLinezolid\n'+
	'0\tVibrio vulnificus\tMetronidazole\n'+
	'90\tVibrio vulnificus\tMinocycline\n'+
	'0\tVibrio vulnificus\tNitrofurantoin (uncomplicated UTI)\n'+
	'90\tVibrio vulnificus\tQuinupristin-Dalfopristin\n'+
	'90\tVibrio vulnificus\tRifampin (not for Staph monotherapy)\n'+
	'90\tVibrio vulnificus\tTelithromycin\n'+
	'90\tVibrio vulnificus\tTigecycline\n'+
	'0\tVibrio vulnificus\tTobramycin\n'+
	'0\tVibrio vulnificus\tTrimethoprim\n'+
	'50\tYersinia enterocolitica\tAmoxicillin-Clavulanate\n'+
	'50\tYersinia enterocolitica\tAmpicillin-Sulbactam\n'+
	'0\tYersinia enterocolitica\tAmpicillin/Amoxicillin\n'+
	'90\tYersinia enterocolitica\tAztreonam\n'+
	'0\tYersinia enterocolitica\tCefazolin\n'+
	'90\tYersinia enterocolitica\tCefepime\n'+
	'90\tYersinia enterocolitica\tCefixime\n'+
	'90\tYersinia enterocolitica\tCefotaxime\n'+
	'50\tYersinia enterocolitica\tCefotetan\n'+
	'50\tYersinia enterocolitica\tCefoxitin\n'+
	'50\tYersinia enterocolitica\tCeftazidime\n'+
	'90\tYersinia enterocolitica\tCeftibuten\n'+
	'90\tYersinia enterocolitica\tCeftizoxime\n'+
	'90\tYersinia enterocolitica\tCeftriaxone\n'+
	'50\tYersinia enterocolitica\tCefuroxime\n'+
	'90\tYersinia enterocolitica\tChloramphenicol\n'+
	'90\tYersinia enterocolitica\tCiprofloxacin\n'+
	'0\tYersinia enterocolitica\tCloxacillin/Dicloxacilin\n'+
	'0\tYersinia enterocolitica\tDaptomycin (non-pneumonia)\n'+
	'90\tYersinia enterocolitica\tDoripenem\n'+
	'90\tYersinia enterocolitica\tDoxycycline\n'+
	'90\tYersinia enterocolitica\tGatifloxacin\n'+
	'90\tYersinia enterocolitica\tGentamicin\n'+
	'90\tYersinia enterocolitica\tImipenem\n'+
	'90\tYersinia enterocolitica\tLevofloxacin\n'+
	'0\tYersinia enterocolitica\tLinezolid\n'+
	'0\tYersinia enterocolitica\tMethicillin\n'+
	'0\tYersinia enterocolitica\tMetronidazole\n'+
	'90\tYersinia enterocolitica\tMoxifloxacin\n'+
	'0\tYersinia enterocolitica\tNafcillin/Oxacillin\n'+
	'90\tYersinia enterocolitica\tOfloxacin\n'+
	'90\tYersinia enterocolitica\tPefloxacin\n'+
	'0\tYersinia enterocolitica\tPenicillin G\n'+
	'0\tYersinia enterocolitica\tPenicillin V\n'+
	'90\tYersinia enterocolitica\tPiperacillin\n'+
	'90\tYersinia enterocolitica\tRifampin (not for Staph monotherapy)\n'+
	'90\tYersinia enterocolitica\tTMP-SMX\n'+
	'50\tYersinia enterocolitica\tTicarcillin\n'+
	'90\tYersinia enterocolitica\tTicarcillin-Clavulanate\n'+
	'90\tZygomycetes (Absidia, Mucor, Rhizopus)\tAmphotericin B\n'+
	'0\tZygomycetes (Absidia, Mucor, Rhizopus)\tCaspofungin\n'+
	'0\tZygomycetes (Absidia, Mucor, Rhizopus)\tFluconazole\n'+
	'50\tZygomycetes (Absidia, Mucor, Rhizopus)\tItraconazole\n'+
	'0\tZygomycetes (Absidia, Mucor, Rhizopus)\tVoriconazole'+
	'';

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
    '89\tEnterococcus (unspeciated)\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '92\tCitrobacter freundii\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '60\tCitrobacter koseri\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '15\tEnterobacter aerogenes\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '31\tEnterobacter cloacae\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '95\tEscheria coli\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '83\tKlebsiella oxytoca\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '24\tKlebsiella pneumoniae\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tMorganella\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tProteus mirabilis\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tProteus vulgaris\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tSerratia\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '27\tGram Negative Rods (anaerobes, other)\tNumber Tested\n'+
    '100\tGram Negative Rods (anaerobes, other)\tAmpicillin-Sulbactam\n'+
    '100\tGram Negative Rods (anaerobes, other)\tPenicillin G\n'+
    '100\tGram Negative Rods (anaerobes, other)\tPiperacillin-Tazobactam\n'+
    '100\tGram Negative Rods (anaerobes, other)\tMeropenem\n'+
    '81\tGram Negative Rods (anaerobes, other)\tClindamycin\n'+
    '100\tGram Negative Rods (anaerobes, other)\tMetronidazole\n'+
    '37\tGram Positive Rods (anaerobes)\tNumber Tested\n'+
    '100\tGram Positive Rods (anaerobes)\tAmpicillin-Sulbactam\n'+
    '81\tGram Positive Rods (anaerobes)\tPenicillin G\n'+
    '100\tGram Positive Rods (anaerobes)\tPiperacillin-Tazobactam\n'+
    '100\tGram Positive Rods (anaerobes)\tMeropenem\n'+
    '76\tGram Positive Rods (anaerobes)\tClindamycin\n'+
    '86\tGram Positive Rods (anaerobes)\tMetronidazole\n'+
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
    '100\tEnterococcus faecalis\tNitrofurantoin (uncomplicated UTI)\n'+
    '100\tEnterococcus faecalis\tVancomycin\n'+
    '83\tEnterococcus (unspeciated)\tNumber Tested\n'+
    '100\tEnterococcus (unspeciated)\tAmpicillin/Amoxicillin\n'+
    '98\tEnterococcus (unspeciated)\tPenicillin G\n'+
    '67\tEnterococcus (unspeciated)\tLevofloxacin\n'+
    '0\tEnterococcus (unspeciated)\tClindamycin\n'+
    '19\tEnterococcus (unspeciated)\tErythromycin\n'+
    '94\tEnterococcus (unspeciated)\tLinezolid\n'+
    '96\tEnterococcus (unspeciated)\tNitrofurantoin (uncomplicated UTI)\n'+
    '98\tEnterococcus (unspeciated)\tVancomycin\n'+
    '237\tStaphylococcus aureus (all)\tNumber Tested\n'+
    '49\tStaphylococcus aureus (all)\tNafcillin/Oxacillin\n'+
    '1\tStaphylococcus aureus (all)\tPenicillin G\n'+
    '51\tStaphylococcus aureus (all)\tLevofloxacin\n'+
    '51\tStaphylococcus aureus (all)\tMoxifloxacin\n'+
    '79\tStaphylococcus aureus (all)\tClindamycin\n'+
    '39\tStaphylococcus aureus (all)\tErythromycin\n'+
    '100\tStaphylococcus aureus (all)\tLinezolid\n'+
    '100\tStaphylococcus aureus (all)\tRifampin (not for Staph monotherapy)\n'+
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
    '100\tStaphylococcus capitis\tNitrofurantoin (uncomplicated UTI)\n'+
    '100\tStaphylococcus capitis\tRifampin (not for Staph monotherapy)\n'+
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
    '100\tStaphylococcus hominis\tNitrofurantoin (uncomplicated UTI)\n'+
    '100\tStaphylococcus hominis\tRifampin (not for Staph monotherapy)\n'+
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
    '100\tStaphylococcus lugdunensis\tNitrofurantoin (uncomplicated UTI)\n'+
    '90\tStaphylococcus lugdunensis\tRifampin (not for Staph monotherapy)\n'+
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
    '97\tStaphylococcus, Coagulase Negative (epidermidis)\tNitrofurantoin (uncomplicated UTI)\n'+
    '97\tStaphylococcus, Coagulase Negative (epidermidis)\tRifampin (not for Staph monotherapy)\n'+
    '60\tStaphylococcus, Coagulase Negative (epidermidis)\tTMP-SMX\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tVancomycin\n'+
    '12\tStreptococcus pneumoniae\tNumber Tested\n'+
    '92\tStreptococcus pneumoniae\tPenicillin G\tNon-Meningitis Sensitivity Only\n'+
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
    '92\tCitrobacter freundii\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '33\tEnterobacter cloacae\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '98\tEscheria coli\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '28\tKlebsiella pneumoniae\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tMorganella\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tProteus mirabilis\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tPseudomonas aeruginosa\tNitrofurantoin (uncomplicated UTI)\n'+
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
    '0\tSerratia marcescens\tNitrofurantoin (uncomplicated UTI)\n'+
    '100\tSerratia marcescens\tErtapenem\n'+
    '100\tSerratia marcescens\tImipenem\n'+
    '100\tSerratia marcescens\tTMP-SMX\n'+
    '10\tStenotrophomonas maltophilia\tNumber Tested\n'+
    '90\tStenotrophomonas maltophilia\tTMP-SMX\n'+
    '';

SENSITIVITY_DATA_PER_SOURCE["Stanford2012"] = ''+
    '210\tStreptococcus Group B (agalactiae)\tNumber Tested\n'+
    '100\tStreptococcus Group B (agalactiae)\tPenicillin G\n'+
    '100\tStreptococcus Group B (agalactiae)\tAmpicillin/Amoxicillin\n'+
    '59\tStreptococcus Group B (agalactiae)\tErythromycin\n'+
    '67\tStreptococcus Group B (agalactiae)\tClindamycin\n'+
    '198\tStreptococcus viridans Group\tNumber Tested\n'+
    '79\tStreptococcus viridans Group\tPenicillin G\n'+
    '79\tStreptococcus viridans Group\tAmpicillin/Amoxicillin\n'+
    '99\tStreptococcus viridans Group\tCeftriaxone\n'+
    '100\tStreptococcus viridans Group\tVancomycin\n'+
    '67\tStreptococcus viridans Group\tErythromycin\n'+
    '88\tStreptococcus viridans Group\tClindamycin\n'+
    '59\tStreptococcus pneumoniae\tNumber Tested\n'+
    '78\tStreptococcus pneumoniae\tPenicillin G\n'+
    '78\tStreptococcus pneumoniae\tAmpicillin/Amoxicillin\n'+
    '90\tStreptococcus pneumoniae\tCefuroxime\n'+
    '95\tStreptococcus pneumoniae\tCeftriaxone\n'+
    '100\tStreptococcus pneumoniae\tVancomycin\n'+
    '78\tStreptococcus pneumoniae\tErythromycin\n'+
    '79\tStreptococcus pneumoniae\tClindamycin\n'+
    '93\tStreptococcus pneumoniae\tMeropenem\n'+
    '76\tStreptococcus pneumoniae\tTMP-SMX\n'+
    '100\tStreptococcus pneumoniae\tMoxifloxacin\n'+
    '809\tEnterococcus (unspeciated)\tNumber Tested\n'+
    '89\tEnterococcus (unspeciated)\tPenicillin G\n'+
    '89\tEnterococcus (unspeciated)\tAmpicillin/Amoxicillin\n'+
    '93\tEnterococcus (unspeciated)\tVancomycin\n'+
    '20\tEnterococcus (unspeciated)\tDoxycycline\n'+
    '90\tEnterococcus (unspeciated)\tNitrofurantoin (uncomplicated UTI)\n'+
    '66\tEnterococcus (unspeciated)\tCiprofloxacin\n'+
    '100\tEnterococcus (unspeciated)\tLinezolid\n'+
    '78\tEnterococcus faecalis\tNumber Tested\n'+
    '100\tEnterococcus faecalis\tPenicillin G\n'+
    '100\tEnterococcus faecalis\tAmpicillin/Amoxicillin\n'+
    '99\tEnterococcus faecalis\tVancomycin\n'+
    '74\tEnterococcus faecalis\tGentamicin\n'+
    '100\tEnterococcus faecalis\tLinezolid\n'+
    '87\tEnterococcus faecium\tNumber Tested\n'+
    '13\tEnterococcus faecium\tPenicillin G\n'+
    '13\tEnterococcus faecium\tAmpicillin/Amoxicillin\n'+
    '21\tEnterococcus faecium\tVancomycin\n'+
    '60\tEnterococcus faecium\tDoxycycline\n'+
    '96\tEnterococcus faecium\tGentamicin\n'+
    '86\tEnterococcus faecium\tQuinupristin-Dalfopristin\n'+
    '100\tEnterococcus faecium\tLinezolid\n'+

    '77\tCandida albicans\tNumber Tested\n'+
    '100\tCandida albicans\tAmphotericin B\n'+
    '100\tCandida albicans\tCaspofungin\n'+
    '96\tCandida albicans\tFluconazole\n'+
    '96\tCandida albicans\tItraconazole\n'+
    '96\tCandida albicans\tVoriconazole\n'+
    '47\tCandida glabrata\tNumber Tested\n'+
    '100\tCandida glabrata\tAmphotericin B\n'+
    '100\tCandida glabrata\tCaspofungin\n'+
    '81\tCandida glabrata\tFluconazole\n'+
    '51\tCandida glabrata\tItraconazole\n'+
    '89\tCandida glabrata\tVoriconazole\n'+
    '16\tCandida parapsilosis\tNumber Tested\n'+
    '100\tCandida parapsilosis\tAmphotericin B\n'+
    '100\tCandida parapsilosis\tCaspofungin\n'+
    '94\tCandida parapsilosis\tFluconazole\n'+
    '100\tCandida parapsilosis\tItraconazole\n'+
    '100\tCandida parapsilosis\tVoriconazole\n'+
    '4\tCandida krusei\tNumber Tested\n'+
    '100\tCandida krusei\tAmphotericin B\n'+
    '100\tCandida krusei\tCaspofungin\n'+
    '0\tCandida krusei\tFluconazole\n'+
    '50\tCandida krusei\tItraconazole\n'+
    '100\tCandida krusei\tVoriconazole\n'+
    '24\tCandida (other)\tNumber Tested\n'+
    '100\tCandida (other)\tAmphotericin B\n'+
    '100\tCandida (other)\tCaspofungin\n'+
    '92\tCandida (other)\tFluconazole\n'+
    '96\tCandida (other)\tItraconazole\n'+
    '96\tCandida (other)\tVoriconazole\n'+

    '33\tAchromobacter xylosoxidans\tNumber Tested\n'+
    '83\tAchromobacter xylosoxidans\tPiperacillin-Tazobactam\n'+
    '7\tAchromobacter xylosoxidans\tCefepime\n'+
    '0\tAchromobacter xylosoxidans\tAztreonam\n'+
    '87\tAchromobacter xylosoxidans\tImipenem\n'+
    '73\tAchromobacter xylosoxidans\tMeropenem\n'+
    '0\tAchromobacter xylosoxidans\tGentamicin\n'+
    '0\tAchromobacter xylosoxidans\tTobramycin\n'+
    '3\tAchromobacter xylosoxidans\tAmikacin\n'+
    '7\tAchromobacter xylosoxidans\tCiprofloxacin\n'+
    '40\tAchromobacter xylosoxidans\tLevofloxacin\n'+
    '80\tAchromobacter xylosoxidans\tTMP-SMX\n'+
    '7\tBurkholderia cepacia\tNumber Tested\n'+
    '71\tBurkholderia cepacia\tMinocycline\n'+
    '86\tBurkholderia cepacia\tCeftazidime\n'+
    '57\tBurkholderia cepacia\tMeropenem\n'+
    '71\tBurkholderia cepacia\tTMP-SMX\n'+
    '23\tAcinetobacter\tNumber Tested\n'+
    '78\tAcinetobacter\tAmpicillin-Sulbactam\n'+
    '74\tAcinetobacter\tCefepime\n'+
    '83\tAcinetobacter\tMeropenem\n'+
    '78\tAcinetobacter\tGentamicin\n'+
    '78\tAcinetobacter\tTobramycin\n'+
    '78\tAcinetobacter\tAmikacin\n'+
    '74\tAcinetobacter\tCiprofloxacin\n'+
    '83\tAcinetobacter\tLevofloxacin\n'+
    '78\tAcinetobacter\tTMP-SMX\n'+
    '67\tCitrobacter freundii\tNumber Tested\n'+
    '0\tCitrobacter freundii\tAmpicillin/Amoxicillin\n'+
    '0\tCitrobacter freundii\tAmpicillin-Sulbactam\n'+
    '90\tCitrobacter freundii\tPiperacillin-Tazobactam\n'+
    '0\tCitrobacter freundii\tCefazolin\n'+
    '81\tCitrobacter freundii\tCeftriaxone\n'+
    '100\tCitrobacter freundii\tCefepime\n'+
    '77\tCitrobacter freundii\tAztreonam\n'+
    '100\tCitrobacter freundii\tImipenem\n'+
    '100\tCitrobacter freundii\tMeropenem\n'+
    '90\tCitrobacter freundii\tGentamicin\n'+
    '91\tCitrobacter freundii\tTobramycin\n'+
    '100\tCitrobacter freundii\tAmikacin\n'+
    '91\tCitrobacter freundii\tCiprofloxacin\n'+
    '93\tCitrobacter freundii\tLevofloxacin\n'+
    '72\tCitrobacter freundii\tTMP-SMX\n'+
    '79\tCitrobacter freundii\tNitrofurantoin (uncomplicated UTI)\n'+
    '57\tCitrobacter koseri\tNumber Tested\n'+
    '0\tCitrobacter koseri\tAmpicillin/Amoxicillin\n'+
    '0\tCitrobacter koseri\tAmpicillin-Sulbactam\n'+
    '100\tCitrobacter koseri\tPiperacillin-Tazobactam\n'+
    '100\tCitrobacter koseri\tCefazolin\n'+
    '100\tCitrobacter koseri\tCeftriaxone\n'+
    '100\tCitrobacter koseri\tCefepime\n'+
    '100\tCitrobacter koseri\tAztreonam\n'+
    '100\tCitrobacter koseri\tImipenem\n'+
    '100\tCitrobacter koseri\tMeropenem\n'+
    '100\tCitrobacter koseri\tGentamicin\n'+
    '100\tCitrobacter koseri\tTobramycin\n'+
    '100\tCitrobacter koseri\tAmikacin\n'+
    '100\tCitrobacter koseri\tCiprofloxacin\n'+
    '100\tCitrobacter koseri\tLevofloxacin\n'+
    '98\tCitrobacter koseri\tTMP-SMX\n'+
    '40\tCitrobacter koseri\tNitrofurantoin (uncomplicated UTI)\n'+
    '95\tEnterobacter aerogenes\tNumber Tested\n'+
    '0\tEnterobacter aerogenes\tAmpicillin/Amoxicillin\n'+
    '0\tEnterobacter aerogenes\tAmpicillin-Sulbactam\n'+
    '91\tEnterobacter aerogenes\tPiperacillin-Tazobactam\n'+
    '0\tEnterobacter aerogenes\tCefazolin\n'+
    '85\tEnterobacter aerogenes\tCeftriaxone\n'+
    '99\tEnterobacter aerogenes\tCefepime\n'+
    '80\tEnterobacter aerogenes\tAztreonam\n'+
    '90\tEnterobacter aerogenes\tImipenem\n'+
    '100\tEnterobacter aerogenes\tMeropenem\n'+
    '100\tEnterobacter aerogenes\tGentamicin\n'+
    '100\tEnterobacter aerogenes\tTobramycin\n'+
    '100\tEnterobacter aerogenes\tAmikacin\n'+
    '99\tEnterobacter aerogenes\tCiprofloxacin\n'+
    '98\tEnterobacter aerogenes\tLevofloxacin\n'+
    '97\tEnterobacter aerogenes\tTMP-SMX\n'+
    '10\tEnterobacter aerogenes\tNitrofurantoin (uncomplicated UTI)\n'+
    '165\tEnterobacter cloacae\tNumber Tested\n'+
    '0\tEnterobacter cloacae\tAmpicillin/Amoxicillin\n'+
    '0\tEnterobacter cloacae\tAmpicillin-Sulbactam\n'+
    '93\tEnterobacter cloacae\tPiperacillin-Tazobactam\n'+
    '0\tEnterobacter cloacae\tCefazolin\n'+
    '75\tEnterobacter cloacae\tCeftriaxone\n'+
    '99\tEnterobacter cloacae\tCefepime\n'+
    '91\tEnterobacter cloacae\tAztreonam\n'+
    '98\tEnterobacter cloacae\tImipenem\n'+
    '99\tEnterobacter cloacae\tMeropenem\n'+
    '99\tEnterobacter cloacae\tGentamicin\n'+
    '99\tEnterobacter cloacae\tTobramycin\n'+
    '100\tEnterobacter cloacae\tAmikacin\n'+
    '95\tEnterobacter cloacae\tCiprofloxacin\n'+
    '95\tEnterobacter cloacae\tLevofloxacin\n'+
    '96\tEnterobacter cloacae\tTMP-SMX\n'+
    '37\tEnterobacter cloacae\tNitrofurantoin (uncomplicated UTI)\n'+
    '2497\tEscheria coli\tNumber Tested\n'+
    '48\tEscheria coli\tAmpicillin/Amoxicillin\n'+
    '61\tEscheria coli\tAmpicillin-Sulbactam\n'+
    '92\tEscheria coli\tPiperacillin-Tazobactam\n'+
    '84\tEscheria coli\tCefazolin\n'+
    '93\tEscheria coli\tCeftriaxone\n'+
    '97\tEscheria coli\tCefepime\n'+
    '92\tEscheria coli\tAztreonam\n'+
    '100\tEscheria coli\tImipenem\n'+
    '100\tEscheria coli\tMeropenem\n'+
    '89\tEscheria coli\tGentamicin\n'+
    '90\tEscheria coli\tTobramycin\n'+
    '100\tEscheria coli\tAmikacin\n'+
    '77\tEscheria coli\tCiprofloxacin\n'+
    '78\tEscheria coli\tLevofloxacin\n'+
    '64\tEscheria coli\tTMP-SMX\n'+
    '61\tEscheria coli\tCephalexin\n'+
    '95\tEscheria coli\tNitrofurantoin (uncomplicated UTI)\n'+
    '102\tKlebsiella oxytoca\tNumber Tested\n'+
    '0\tKlebsiella oxytoca\tAmpicillin/Amoxicillin\n'+
    '75\tKlebsiella oxytoca\tAmpicillin-Sulbactam\n'+
    '92\tKlebsiella oxytoca\tPiperacillin-Tazobactam\n'+
    '68\tKlebsiella oxytoca\tCefazolin\n'+
    '96\tKlebsiella oxytoca\tCeftriaxone\n'+
    '98\tKlebsiella oxytoca\tCefepime\n'+
    '93\tKlebsiella oxytoca\tAztreonam\n'+
    '100\tKlebsiella oxytoca\tImipenem\n'+
    '100\tKlebsiella oxytoca\tMeropenem\n'+
    '99\tKlebsiella oxytoca\tGentamicin\n'+
    '100\tKlebsiella oxytoca\tTobramycin\n'+
    '100\tKlebsiella oxytoca\tAmikacin\n'+
    '98\tKlebsiella oxytoca\tCiprofloxacin\n'+
    '99\tKlebsiella oxytoca\tLevofloxacin\n'+
    '91\tKlebsiella oxytoca\tTMP-SMX\n'+
    '80\tKlebsiella oxytoca\tNitrofurantoin (uncomplicated UTI)\n'+
    '459\tKlebsiella pneumoniae\tNumber Tested\n'+
    '0\tKlebsiella pneumoniae\tAmpicillin/Amoxicillin\n'+
    '85\tKlebsiella pneumoniae\tAmpicillin-Sulbactam\n'+
    '94\tKlebsiella pneumoniae\tPiperacillin-Tazobactam\n'+
    '93\tKlebsiella pneumoniae\tCefazolin\n'+
    '93\tKlebsiella pneumoniae\tCeftriaxone\n'+
    '96\tKlebsiella pneumoniae\tCefepime\n'+
    '91\tKlebsiella pneumoniae\tAztreonam\n'+
    '99\tKlebsiella pneumoniae\tImipenem\n'+
    '99\tKlebsiella pneumoniae\tMeropenem\n'+
    '98\tKlebsiella pneumoniae\tGentamicin\n'+
    '95\tKlebsiella pneumoniae\tTobramycin\n'+
    '99\tKlebsiella pneumoniae\tAmikacin\n'+
    '92\tKlebsiella pneumoniae\tCiprofloxacin\n'+
    '92\tKlebsiella pneumoniae\tLevofloxacin\n'+
    '86\tKlebsiella pneumoniae\tTMP-SMX\n'+
    '25\tKlebsiella pneumoniae\tNitrofurantoin (uncomplicated UTI)\n'+
    '36\tMorganella\tNumber Tested\n'+
    '0\tMorganella\tAmpicillin/Amoxicillin\n'+
    '9\tMorganella\tAmpicillin-Sulbactam\n'+
    '100\tMorganella\tPiperacillin-Tazobactam\n'+
    '0\tMorganella\tCefazolin\n'+
    '81\tMorganella\tCeftriaxone\n'+
    '100\tMorganella\tCefepime\n'+
    '100\tMorganella\tAztreonam\n'+
    '100\tMorganella\tMeropenem\n'+
    '81\tMorganella\tGentamicin\n'+
    '92\tMorganella\tTobramycin\n'+
    '100\tMorganella\tAmikacin\n'+
    '11\tMorganella\tCiprofloxacin\n'+
    '83\tMorganella\tLevofloxacin\n'+
    '61\tMorganella\tTMP-SMX\n'+
    '0\tMorganella\tNitrofurantoin (uncomplicated UTI)\n'+
    '233\tProteus mirabilis\tNumber Tested\n'+
    '77\tProteus mirabilis\tAmpicillin/Amoxicillin\n'+
    '87\tProteus mirabilis\tAmpicillin-Sulbactam\n'+
    '100\tProteus mirabilis\tPiperacillin-Tazobactam\n'+
    '73\tProteus mirabilis\tCefazolin\n'+
    '97\tProteus mirabilis\tCeftriaxone\n'+
    '99\tProteus mirabilis\tCefepime\n'+
    '100\tProteus mirabilis\tAztreonam\n'+
    '100\tProteus mirabilis\tMeropenem\n'+
    '91\tProteus mirabilis\tGentamicin\n'+
    '93\tProteus mirabilis\tTobramycin\n'+
    '100\tProteus mirabilis\tAmikacin\n'+
    '87\tProteus mirabilis\tCiprofloxacin\n'+
    '89\tProteus mirabilis\tLevofloxacin\n'+
    '75\tProteus mirabilis\tTMP-SMX\n'+
    '0\tProteus mirabilis\tNitrofurantoin (uncomplicated UTI)\n'+
    '4\tProteus vulgaris\tNumber Tested\n'+
    '0\tProteus vulgaris\tAmpicillin/Amoxicillin\n'+
    '50\tProteus vulgaris\tAmpicillin-Sulbactam\n'+
    '100\tProteus vulgaris\tPiperacillin-Tazobactam\n'+
    '0\tProteus vulgaris\tCefazolin\n'+
    '100\tProteus vulgaris\tCefepime\n'+
    '100\tProteus vulgaris\tAztreonam\n'+
    '100\tProteus vulgaris\tMeropenem\n'+
    '100\tProteus vulgaris\tGentamicin\n'+
    '100\tProteus vulgaris\tTobramycin\n'+
    '100\tProteus vulgaris\tAmikacin\n'+
    '100\tProteus vulgaris\tCiprofloxacin\n'+
    '100\tProteus vulgaris\tLevofloxacin\n'+
    '100\tProteus vulgaris\tTMP-SMX\n'+
    '0\tProteus vulgaris\tNitrofurantoin (uncomplicated UTI)\n'+
    '372\tPseudomonas aeruginosa CF mucoid\tNumber Tested\n'+
    '73\tPseudomonas aeruginosa CF mucoid\tTicarcillin\n'+
    '79\tPseudomonas aeruginosa CF mucoid\tPiperacillin\n'+
    '79\tPseudomonas aeruginosa CF mucoid\tCefepime\n'+
    '72\tPseudomonas aeruginosa CF mucoid\tAztreonam\n'+
    '72\tPseudomonas aeruginosa CF mucoid\tImipenem\n'+
    '78\tPseudomonas aeruginosa CF mucoid\tMeropenem\n'+
    '86\tPseudomonas aeruginosa CF mucoid\tTobramycin\n'+
    '58\tPseudomonas aeruginosa CF mucoid\tCiprofloxacin\n'+
    '343\tPseudomonas aeruginosa CF non-mucoid\tNumber Tested\n'+
    '71\tPseudomonas aeruginosa CF non-mucoid\tTicarcillin\n'+
    '77\tPseudomonas aeruginosa CF non-mucoid\tPiperacillin\n'+
    '70\tPseudomonas aeruginosa CF non-mucoid\tCefepime\n'+
    '66\tPseudomonas aeruginosa CF non-mucoid\tAztreonam\n'+
    '64\tPseudomonas aeruginosa CF non-mucoid\tImipenem\n'+
    '72\tPseudomonas aeruginosa CF non-mucoid\tMeropenem\n'+
    '61\tPseudomonas aeruginosa CF non-mucoid\tTobramycin\n'+
    '44\tPseudomonas aeruginosa CF non-mucoid\tCiprofloxacin\n'+
    '322\tPseudomonas aeruginosa\tNumber Tested\n'+
    '94\tPseudomonas aeruginosa\tPiperacillin-Tazobactam\n'+
    '87\tPseudomonas aeruginosa\tCefepime\n'+
    '76\tPseudomonas aeruginosa\tAztreonam\n'+
    '78\tPseudomonas aeruginosa\tImipenem\n'+
    '88\tPseudomonas aeruginosa\tMeropenem\n'+
    '87\tPseudomonas aeruginosa\tGentamicin\n'+
    '93\tPseudomonas aeruginosa\tTobramycin\n'+
    '93\tPseudomonas aeruginosa\tAmikacin\n'+
    '79\tPseudomonas aeruginosa\tCiprofloxacin\n'+
    '76\tPseudomonas aeruginosa\tLevofloxacin\n'+
    '81\tSerratia marcescens\tNumber Tested\n'+
    '0\tSerratia marcescens\tAmpicillin/Amoxicillin\n'+
    '0\tSerratia marcescens\tAmpicillin-Sulbactam\n'+
    '100\tSerratia marcescens\tPiperacillin-Tazobactam\n'+
    '0\tSerratia marcescens\tCefazolin\n'+
    '95\tSerratia marcescens\tCeftriaxone\n'+
    '100\tSerratia marcescens\tCefepime\n'+
    '98\tSerratia marcescens\tAztreonam\n'+
    '99\tSerratia marcescens\tImipenem\n'+
    '100\tSerratia marcescens\tMeropenem\n'+
    '100\tSerratia marcescens\tGentamicin\n'+
    '96\tSerratia marcescens\tTobramycin\n'+
    '100\tSerratia marcescens\tAmikacin\n'+
    '89\tSerratia marcescens\tCiprofloxacin\n'+
    '96\tSerratia marcescens\tLevofloxacin\n'+
    '98\tSerratia marcescens\tTMP-SMX\n'+
    '0\tSerratia marcescens\tNitrofurantoin (uncomplicated UTI)\n'+
    '103\tStenotrophomonas maltophilia\tNumber Tested\n'+
    '50\tStenotrophomonas maltophilia\tTicarcillin-Clavulanate\n'+
    '87\tStenotrophomonas maltophilia\tLevofloxacin\n'+
    '86\tStenotrophomonas maltophilia\tTMP-SMX\n'+
    '10\tSalmonella\tNumber Tested\n'+
    '70\tSalmonella\tAmpicillin/Amoxicillin\n'+
    '90\tSalmonella\tCeftriaxone\n'+
    '60\tSalmonella\tCiprofloxacin\n'+
    '90\tSalmonella\tTMP-SMX\n'+

    '1197\tStaphylococcus aureus (all)\tNumber Tested\n'+
    '19\tStaphylococcus aureus (all)\tPenicillin G\n'+
    '75\tStaphylococcus aureus (all)\tNafcillin/Oxacillin\n'+
    '75\tStaphylococcus aureus (all)\tCephalexin\n'+
    '100\tStaphylococcus aureus (all)\tVancomycin\n'+
    '54\tStaphylococcus aureus (all)\tErythromycin\n'+
    '71\tStaphylococcus aureus (all)\tClindamycin\n'+
    '97\tStaphylococcus aureus (all)\tGentamicin\n'+
    '99\tStaphylococcus aureus (all)\tTMP-SMX\n'+
    '73\tStaphylococcus aureus (all)\tMoxifloxacin\n'+
    '94\tStaphylococcus aureus (all)\tDoxycycline\n'+
    '100\tStaphylococcus aureus (all)\tLinezolid\n'+
    '299\tStaphylococcus aureus (MRSA)\tNumber Tested\n'+
    '0\tStaphylococcus aureus (MRSA)\tPenicillin G\n'+
    '0\tStaphylococcus aureus (MRSA)\tNafcillin/Oxacillin\n'+
    '0\tStaphylococcus aureus (MRSA)\tCephalexin\n'+
    '100\tStaphylococcus aureus (MRSA)\tVancomycin\n'+
    '8\tStaphylococcus aureus (MRSA)\tErythromycin\n'+
    '44\tStaphylococcus aureus (MRSA)\tClindamycin\n'+
    '95\tStaphylococcus aureus (MRSA)\tGentamicin\n'+
    '96\tStaphylococcus aureus (MRSA)\tTMP-SMX\n'+
    '22\tStaphylococcus aureus (MRSA)\tMoxifloxacin\n'+
    '92\tStaphylococcus aureus (MRSA)\tDoxycycline\n'+
    '100\tStaphylococcus aureus (MRSA)\tLinezolid\n'+
    '898\tStaphylococcus aureus (MSSA)\tNumber Tested\n'+
    '43\tStaphylococcus aureus (MSSA)\tPenicillin G\n'+
    '100\tStaphylococcus aureus (MSSA)\tNafcillin/Oxacillin\n'+
    '100\tStaphylococcus aureus (MSSA)\tCephalexin\n'+
    '100\tStaphylococcus aureus (MSSA)\tVancomycin\n'+
    '69\tStaphylococcus aureus (MSSA)\tErythromycin\n'+
    '80\tStaphylococcus aureus (MSSA)\tClindamycin\n'+
    '98\tStaphylococcus aureus (MSSA)\tGentamicin\n'+
    '99\tStaphylococcus aureus (MSSA)\tTMP-SMX\n'+
    '90\tStaphylococcus aureus (MSSA)\tMoxifloxacin\n'+
    '95\tStaphylococcus aureus (MSSA)\tDoxycycline\n'+
    '100\tStaphylococcus aureus (MSSA)\tLinezolid\n'+
    '88\tStaphylococcus lugdunensis\tNumber Tested\n'+
    '53\tStaphylococcus lugdunensis\tPenicillin G\n'+
    '98\tStaphylococcus lugdunensis\tNafcillin/Oxacillin\n'+
    '98\tStaphylococcus lugdunensis\tCephalexin\n'+
    '100\tStaphylococcus lugdunensis\tVancomycin\n'+
    '83\tStaphylococcus lugdunensis\tErythromycin\n'+
    '85\tStaphylococcus lugdunensis\tClindamycin\n'+
    '100\tStaphylococcus lugdunensis\tGentamicin\n'+
    '100\tStaphylococcus lugdunensis\tTMP-SMX\n'+
    '98\tStaphylococcus lugdunensis\tMoxifloxacin\n'+
    '100\tStaphylococcus lugdunensis\tLinezolid\n'+
    '307\tStaphylococcus, Coagulase Negative (epidermidis)\tNumber Tested\n'+
    '15\tStaphylococcus, Coagulase Negative (epidermidis)\tPenicillin G\n'+
    '47\tStaphylococcus, Coagulase Negative (epidermidis)\tNafcillin/Oxacillin\n'+
    '47\tStaphylococcus, Coagulase Negative (epidermidis)\tCephalexin\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tVancomycin\n'+
    '41\tStaphylococcus, Coagulase Negative (epidermidis)\tErythromycin\n'+
    '62\tStaphylococcus, Coagulase Negative (epidermidis)\tClindamycin\n'+
    '79\tStaphylococcus, Coagulase Negative (epidermidis)\tGentamicin\n'+
    '64\tStaphylococcus, Coagulase Negative (epidermidis)\tTMP-SMX\n'+
    '56\tStaphylococcus, Coagulase Negative (epidermidis)\tMoxifloxacin\n'+
    '100\tStaphylococcus, Coagulase Negative (epidermidis)\tLinezolid\n'+

    '28\tBacteroides fragilis\tNumber Tested\n'+
    '100\tBacteroides fragilis\tAmpicillin-Sulbactam\n'+
    '0\tBacteroides fragilis\tPenicillin G\n'+
    '100\tBacteroides fragilis\tPiperacillin-Tazobactam\n'+
    '96\tBacteroides fragilis\tMeropenem\n'+
    '75\tBacteroides fragilis\tClindamycin\n'+
    '96\tBacteroides fragilis\tMetronidazole\n'+
    '31\tBacteroides (not fragilis)\tNumber Tested\n'+
    '81\tBacteroides (not fragilis)\tAmpicillin-Sulbactam\n'+
    '0\tBacteroides (not fragilis)\tPenicillin G\n'+
    '87\tBacteroides (not fragilis)\tPiperacillin-Tazobactam\n'+
    '98\tBacteroides (not fragilis)\tMeropenem\n'+
    '32\tBacteroides (not fragilis)\tClindamycin\n'+
    '100\tBacteroides (not fragilis)\tMetronidazole\n'+
    '41\tGram Negative Rods (anaerobes, other)\tNumber Tested\n'+
    '100\tGram Negative Rods (anaerobes, other)\tAmpicillin-Sulbactam\n'+
    '100\tGram Negative Rods (anaerobes, other)\tPenicillin G\n'+
    '100\tGram Negative Rods (anaerobes, other)\tPiperacillin-Tazobactam\n'+
    '100\tGram Negative Rods (anaerobes, other)\tMeropenem\n'+
    '86\tGram Negative Rods (anaerobes, other)\tClindamycin\n'+
    '100\tGram Negative Rods (anaerobes, other)\tMetronidazole\n'+
    '43\tGram Positive Rods (anaerobes)\tNumber Tested\n'+
    '97\tGram Positive Rods (anaerobes)\tAmpicillin-Sulbactam\n'+
    '76\tGram Positive Rods (anaerobes)\tPenicillin G\n'+
    '97\tGram Positive Rods (anaerobes)\tPiperacillin-Tazobactam\n'+
    '97\tGram Positive Rods (anaerobes)\tMeropenem\n'+
    '74\tGram Positive Rods (anaerobes)\tClindamycin\n'+
    '81\tGram Positive Rods (anaerobes)\tMetronidazole\n'+
    '10\tClostridium (not difficile)\tNumber Tested\n'+
    '100\tClostridium (not difficile)\tPenicillin G\n'+
    '90\tClostridium (not difficile)\tClindamycin\n'+
    '100\tClostridium (not difficile)\tMetronidazole\n'+
    '21\tPeptostreptococcus\tNumber Tested\n'+
    '85\tPeptostreptococcus\tPenicillin G\n'+
    '95\tPeptostreptococcus\tClindamycin\n'+
    '95\tPeptostreptococcus\tMetronidazole\n'+

    '';
SENSITIVITY_DATA_PER_SOURCE["default"] = SENSITIVITY_DATA_PER_SOURCE["Stanford2012"];
