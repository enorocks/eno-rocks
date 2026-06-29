export type CategoryId =
    | 'basics'
    | 'macros'
    | 'micros'
    | 'supplements'
    | 'training'
    | 'tracking'
    | 'weight'
    | 'body'
    | 'habits';

export type GlossaryTerm = {
    id: string;
    title: string;
    category: CategoryId;
    aliases: string[];
    description: string;
};

export type FilterId =
    | 'all'
    | 'nutrition'
    | 'supplements'
    | 'training'
    | 'tracking'
    | 'body'
    | 'habits';

export const FILTER_OPTIONS: { id: FilterId; label: string; categories: CategoryId[] }[] = [
    {
        id: 'all',
        label: 'Alle',
        categories: ['basics', 'macros', 'micros', 'supplements', 'training', 'tracking', 'weight', 'body', 'habits'],
    },
    {
        id: 'nutrition',
        label: 'Essen',
        categories: ['basics', 'macros', 'micros', 'weight'],
    },
    { id: 'supplements', label: 'Supplements', categories: ['supplements'] },
    { id: 'training', label: 'Training', categories: ['training'] },
    { id: 'tracking', label: 'Tracking', categories: ['tracking'] },
    { id: 'body', label: 'Körper', categories: ['body'] },
    { id: 'habits', label: 'Alltag', categories: ['habits'] },
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
    basics: 'Basics',
    macros: 'Makros',
    micros: 'Mikros',
    supplements: 'Supplements',
    training: 'Training',
    tracking: 'Tracking',
    weight: 'Abnehmen',
    body: 'Körper',
    habits: 'Alltag',
};

function slug(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function term(
    title: string,
    category: CategoryId,
    description: string,
    aliases: string[] = [],
): GlossaryTerm {
    const id = slug(title);
    return { id, title, category, aliases, description };
}

export const TERMS: GlossaryTerm[] = [
    term('Kalorie', 'basics', 'Eine Kalorie ist eine Energieeinheit und beschreibt, wie viel Energie dein Körper aus Nahrung bekommen kann. Im Alltag meint man fast immer Kilokalorien, also kcal.', ['kcal', 'kilokalorie', 'kalorien']),
    term('Energiebedarf', 'basics', 'Der Energiebedarf ist die Kalorienmenge, die dein Körper pro Tag ungefähr verbraucht. Er setzt sich aus Grundumsatz, Bewegung, Training und Verdauung zusammen.', ['kalorienbedarf']),
    term('Grundumsatz', 'basics', 'Der Grundumsatz ist die Energie, die dein Körper in völliger Ruhe für Überleben und Grundfunktionen braucht. Atmung, Organe, Gehirn und Körpertemperatur laufen auch ohne Training weiter.', ['bmr']),
    term('Leistungsumsatz', 'basics', 'Der Leistungsumsatz ist die Energie, die durch Alltag, Schritte, Arbeit und Training zusätzlich zum Grundumsatz entsteht. Er schwankt oft stärker als der Grundumsatz.', ['aktivitätsumsatz']),
    term('Gesamtumsatz', 'basics', 'Der Gesamtumsatz ist dein ungefährer Tagesverbrauch inklusive Ruhe, Alltag, Training und Verdauung. Er wird oft als TDEE bezeichnet.', ['tdee', 'maintenance']),
    term('Energiebilanz', 'basics', 'Die Energiebilanz vergleicht aufgenommene Kalorien mit verbrauchten Kalorien. Ein Defizit führt langfristig zu Gewichtsverlust, ein Überschuss langfristig zu Zunahme.', ['kalorienbilanz']),
    term('Kaloriendefizit', 'basics', 'Ein Kaloriendefizit bedeutet, dass du weniger Energie isst, als du verbrauchst. Für Fettverlust ist es der wichtigste Grundmechanismus.', ['defizit']),
    term('Kalorienüberschuss', 'basics', 'Ein Kalorienüberschuss bedeutet, dass du mehr Energie isst, als du verbrauchst. Er ist hilfreich für Muskelaufbau, kann aber auch Körperfett erhöhen.', ['überschuss', 'surplus']),
    term('Erhaltungskalorien', 'basics', 'Erhaltungskalorien sind die Menge, bei der dein Gewicht im Schnitt stabil bleibt. Einzelne Tage schwanken trotzdem durch Wasser, Salz und Verdauung.', ['maintenance calories']),
    term('Makronährstoffe', 'basics', 'Makronährstoffe sind Protein, Kohlenhydrate und Fett. Sie liefern Energie und erfüllen wichtige Aufgaben im Körper.', ['makros']),
    term('Nährstoffdichte', 'basics', 'Nährstoffdichte bedeutet: viel Nährstoffe und Sättigung bei vergleichsweise wenigen Kalorien. Gemüse, Hülsenfrüchte und mageres Protein sind gute Beispiele.', ['nutrient density']),
    term('Kaloriendichte', 'basics', 'Kaloriendichte beschreibt, wie viele Kalorien ein Lebensmittel pro Gramm hat. Öl, Nüsse und Schokolade sind sehr kaloriendicht, Gemüse meist deutlich weniger.', ['energiedichte']),
    term('Nährwertangaben', 'basics', 'Nährwertangaben zeigen Energie, Makros und oft weitere Nährstoffe pro 100 g oder Portion. Für sauberes Tracken ist pro 100 g meist die verlässlichere Angabe.', ['nutrition facts']),

    term('Protein', 'macros', 'Protein ist ein Makronährstoff und liefert etwa 4 kcal pro Gramm. Es unterstützt Muskelerhalt, Sättigung, Gewebeaufbau und viele Körperfunktionen.', ['eiweiß', 'eiweiss']),
    term('Kohlenhydrate', 'macros', 'Kohlenhydrate liefern etwa 4 kcal pro Gramm und sind eine wichtige Energiequelle. Sie sind besonders nützlich für Training, Alltag und Gehirnleistung.', ['carbs', 'kh']),
    term('Fett', 'macros', 'Fett liefert etwa 9 kcal pro Gramm und ist damit sehr energiereich. Es ist wichtig für Hormone, Zellmembranen, Geschmack und die Aufnahme fettlöslicher Vitamine.', ['fette', 'dietary fat']),
    term('Ballaststoffe', 'macros', 'Ballaststoffe sind unverdauliche oder nur teilweise verwertbare Kohlenhydrate. Sie unterstützen Sättigung, Verdauung und eine stabile Ernährung.', ['fiber', 'fibre']),
    term('Zucker', 'macros', 'Zucker ist eine Form von Kohlenhydraten und liefert Energie. Er ist nicht automatisch verboten, kann aber schnell viele Kalorien liefern und wenig sättigen.', []),
    term('Glykogen', 'macros', 'Glykogen ist gespeicherte Glukose in Muskeln und Leber. Mehr Glykogen bindet auch Wasser, weshalb Gewicht nach kohlenhydratreichen Tagen steigen kann.', []),
    term('Alkoholkalorien', 'macros', 'Alkohol liefert etwa 7 kcal pro Gramm und zählt damit energetisch fast wie ein eigener Makronährstoff. Er kann außerdem Hunger und Entscheidungen rund ums Essen beeinflussen.', ['alkohol']),
    term('Proteinbedarf', 'macros', 'Proteinbedarf beschreibt, wie viel Protein du täglich ungefähr brauchst. Beim Abnehmen und Krafttraining sind oft etwa 1,6 bis 2,2 g pro kg Körpergewicht ein sinnvoller Bereich.', []),
    term('Makroverteilung', 'macros', 'Makroverteilung beschreibt, wie sich deine Kalorien auf Protein, Fett und Kohlenhydrate aufteilen. Sie muss nicht perfekt sein, solange Kalorien und Protein grob passen.', ['macro split']),

    term('Magnesium', 'micros', 'Magnesium ist an Muskelfunktion, Nerven, Energiestoffwechsel und vielen Enzymen beteiligt. Es steckt unter anderem in Nüssen, Vollkorn, Hülsenfrüchten und Mineralwasser.', []),
    term('Vitamin B12', 'micros', 'Vitamin B12 brauchst du vor allem, wenn du wenig oder keine tierischen Lebensmittel isst. Dann sind angereicherte Produkte oder ein Supplement eine Option. Bei anhaltender Müdigkeit lohnt ein Check beim Arzt.', ['cobalamin']),
    term('Vitamin D', 'micros', 'Vitamin D bildet der Körper vor allem durch Sonnenlicht. Im Winter kann die Zufuhr über Ernährung oder ein Supplement sinnvoll sein, wenn du dich müde oder antriebslos fühlst. Eine Messung macht nur mit Arzt oder Labor Sinn.', ['cholecalciferol']),
    term('Elektrolyte', 'micros', 'Elektrolyte sind vor allem Natrium, Kalium und Magnesium. Sie spielen beim Schwitzen im Training und an heißen Tagen eine Rolle. Für den Alltag reicht meist normales Essen und Trinken.', []),

    term('Whey Protein', 'supplements', 'Whey Protein ist Molkenprotein und wird schnell verdaut. Es ist praktisch, wenn du deinen Proteinbedarf mit normalem Essen schwer erreichst.', ['whey', 'molkenprotein', 'whey isolat']),
    term('Kreatin', 'supplements', 'Kreatin unterstützt Kraft und Leistung im Training. Monohydrat ist die übliche Form. Nimm meist 3 bis 5 g pro Tag, auch an trainingsfreien Tagen.', ['creatine', 'creatine monohydrate']),
    term('Koffein', 'supplements', 'Koffein kann Wachheit, Fokus und Trainingsleistung verbessern. Zu spät am Tag kann es den Schlaf stören und damit indirekt Fortschritt bremsen.', ['caffeine']),
    term('Fatburner', 'supplements', 'Fatburner sind Produkte, die Fettverlust versprechen. Meist liefern sie Koffein, Marketing und wenig Magie.', ['fettburner']),
    term('Proteinriegel', 'supplements', 'Proteinriegel sind praktisch, aber oft auch Süßigkeit mit Proteinbonus. Sie können helfen, sollten aber nicht die Basis der Ernährung sein.', ['protein bar']),

    term('Krafttraining', 'training', 'Krafttraining setzt Reize für Muskeln, Kraft und Körperform. Es ist beim Abnehmen hilfreich, weil es Muskelerhalt unterstützt.', ['resistance training']),
    term('Hypertrophie', 'training', 'Hypertrophie bedeutet Muskelwachstum. Dafür brauchst du passende Trainingsreize, ausreichend Protein, Erholung und oft Geduld.', ['muskelaufbau']),
    term('Progressive Overload', 'training', 'Progressive Overload bedeutet, Trainingsreize über Zeit zu steigern. Das kann mehr Gewicht, mehr Wiederholungen, bessere Technik oder mehr Sätze bedeuten.', ['progression']),
    term('Volumen', 'training', 'Trainingsvolumen beschreibt grob die Menge an Arbeit, zum Beispiel Sätze pro Muskel und Woche. Zu wenig kann bremsen, zu viel kann Regeneration sprengen.', ['trainingsvolumen']),
    term('Wiederholungen', 'training', 'Wiederholungen sind einzelne Ausführungen einer Übung in einem Satz. Verschiedene Wiederholungsbereiche können funktionieren, wenn Sätze nah genug am Muskelreiz sind.', ['reps']),
    term('Satz', 'training', 'Ein Satz ist eine Gruppe von Wiederholungen einer Übung. Mehrere Sätze erhöhen den Trainingsreiz, brauchen aber auch mehr Erholung.', ['set']),
    term('RIR', 'training', 'RIR steht für Reps in Reserve und sagt, wie viele Wiederholungen noch möglich gewesen wären. 2 RIR bedeutet, du hättest ungefähr noch zwei saubere Wiederholungen geschafft.', ['reps in reserve']),
    term('RPE', 'training', 'RPE ist eine Skala für Anstrengung. Im Krafttraining beschreibt sie, wie nah ein Satz am Limit war.', ['rate of perceived exertion']),
    term('Muskelversagen', 'training', 'Muskelversagen bedeutet, dass keine weitere saubere Wiederholung mehr möglich ist. Es kann ein Tool sein, ist aber nicht in jedem Satz nötig.', ['failure']),
    term('Regeneration', 'training', 'Regeneration ist die Erholung nach Belastung. Genug essen, nicht jeden Tag maximal trainieren und zwischen den Einheiten Pausen einplanen helfen dir, dich anzupassen.', ['recovery']),
    term('Deload', 'training', 'Ein Deload ist eine bewusst leichtere Trainingsphase. Er kann helfen, Müdigkeit abzubauen und danach wieder besser zu trainieren.', []),
    term('Ganzkörperplan', 'training', 'Ein Ganzkörperplan trainiert mehrere große Muskelgruppen in einer Einheit. Er ist für Einsteiger und knappe Zeit oft sehr effizient.', ['full body']),
    term('Split', 'training', 'Ein Split teilt das Training auf verschiedene Muskelgruppen oder Bewegungsmuster auf. Beispiele sind Oberkörper und Unterkörper oder Push, Pull und Legs.', ['trainingssplit']),
    term('Push Pull Legs', 'training', 'Push Pull Legs teilt Training in Drücken, Ziehen und Beine auf. Der Split ist beliebt, braucht aber meist mehrere Trainingstage pro Woche.', ['ppl']),
    term('Oberkörper Unterkörper', 'training', 'Oberkörper und Unterkörper teilt Einheiten nach Körperregionen. Der Split ist flexibel und passt gut zu zwei bis vier Trainingstagen.', ['upper lower']),
    term('Compound Übung', 'training', 'Compound Übungen bewegen mehrere Gelenke und Muskelgruppen gleichzeitig. Kniebeugen, Rudern, Bankdrücken und Kreuzheben sind typische Beispiele.', ['grundübung']),
    term('Isolation Übung', 'training', 'Isolation Übungen fokussieren stärker auf einen Muskel oder ein Gelenk. Curls, Seitheben und Beinstrecker sind typische Beispiele.', ['isolationsübung']),
    term('Cardio', 'training', 'Cardio trainiert Herz und Kreislauf sowie Ausdauer. Es kann beim Kalorienverbrauch helfen, ersetzt aber kein Kaloriendefizit.', ['ausdauertraining']),
    term('HIIT', 'training', 'HIIT steht für High Intensity Interval Training. Es ist zeiteffizient, aber belastend und nicht automatisch besser als normales Cardio.', ['intervalltraining']),
    term('NEAT', 'training', 'NEAT ist Alltagsbewegung außerhalb von geplantem Sport. Schritte, Hausarbeit und Herumlaufen können beim Verbrauch viel ausmachen.', ['alltagsbewegung']),
    term('Schritte', 'training', 'Schritte sind eine einfache Messgröße für Alltagsbewegung. Sie sind nicht perfekt, aber praktisch für mehr Aktivität im Alltag.', ['steps']),
    term('Trainingsfrequenz', 'training', 'Trainingsfrequenz beschreibt, wie oft du pro Woche trainierst oder einen Muskel belastest. Zwei bis drei Reize pro Muskel können für viele gut funktionieren.', ['frequency']),
    term('Technik', 'training', 'Technik beschreibt die Ausführung einer Übung. Gute Technik macht Training oft sicherer, gezielter und langfristig besser steigerbar.', ['form']),

    term('Tracken', 'tracking', 'Tracken bedeutet, Essen, Kalorien, Makros oder Gewohnheiten bewusst zu erfassen. Es ist ein Werkzeug, kein Muss für immer.', ['tracking']),
    term('Kalorienzählen', 'tracking', 'Kalorienzählen bedeutet, die Energieaufnahme möglichst genau zu erfassen. Es kann sehr hilfreich sein, wenn man Portionsgrößen lernen will.', ['calorie counting']),
    term('Food Tracking App', 'tracking', 'Eine Food Tracking App hilft, Lebensmittel, Mengen und Makros zu erfassen. Die Datenbank kann Fehler enthalten, deshalb lohnt sich ein kurzer Blick auf Verpackungswerte.', ['tracking app']),
    term('Lebensmittel wiegen', 'tracking', 'Lebensmittel wiegen ist die genaueste Alltagstechnik beim Tracken. Besonders Öl, Nüsse, Pasta, Reis und Snacks werden oft unterschätzt.', ['wiegen']),
    term('Rohgewicht', 'tracking', 'Rohgewicht ist das Gewicht eines Lebensmittels vor dem Kochen. Es ist beim Tracken oft einfacher, weil Nährwerte meist für rohe Ware angegeben sind.', ['roh tracken']),
    term('Gargewicht', 'tracking', 'Gargewicht ist das Gewicht nach dem Kochen. Es kann stark schwanken, weil Wasser aufgenommen oder verloren wird.', ['gekocht tracken']),
    term('Rezept tracken', 'tracking', 'Rezept tracken bedeutet, alle Zutaten zu erfassen und auf Portionen aufzuteilen. Das ist bei selbst gekochtem Essen oft genauer als einzelne geschätzte Teller.', ['recipe tracking']),
    term('Wochendurchschnitt', 'tracking', 'Der Wochendurchschnitt glättet tägliche Ausreißer bei Kalorien oder Gewicht. Er ist oft aussagekräftiger als ein einzelner Tag.', ['weekly average']),
    term('Gewichtstrend', 'tracking', 'Der Gewichtstrend zeigt die Richtung über mehrere Tage oder Wochen. Er ist hilfreicher als die einzelne Zahl auf der Waage.', ['trendgewicht']),
    term('Körpermaße', 'tracking', 'Körpermaße wie Taille, Hüfte oder Brust ergänzen die Waage. Sie zeigen Fortschritt, wenn Gewicht durch Wasser oder Muskelaufbau verwirrend wirkt.', ['maßband']),
    term('Tagesbudget', 'tracking', 'Das Tagesbudget ist die Kalorienmenge, die du dir für einen Tag vornimmst. Es darf flexibel bleiben, solange der Wochenschnitt passt.', ['kalorienbudget']),
    term('Kalorienbanking', 'tracking', 'Kalorienbanking bedeutet, an manchen Tagen etwas zu sparen, um an anderen mehr Spielraum zu haben. Es kann helfen, Restaurantbesuche oder Wochenenden einzuplanen.', ['banking']),
    term('Cheat Day', 'tracking', 'Ein Cheat Day ist ein geplanter Tag mit lockererem Essen. Er kann mental helfen, aber auch leicht ein ganzes Wochendefizit löschen.', ['cheatday']),
    term('Refeed', 'tracking', 'Ein Refeed ist ein geplanter Tag mit mehr Kalorien, oft mehr Kohlenhydraten. Er ist kein Muss, kann aber in längeren Diäten psychologisch helfen.', []),
    term('Diet Break', 'tracking', 'Ein Diet Break ist eine geplante Pause vom Defizit auf Erhaltungskalorien. Er kann helfen, Hunger und mentale Müdigkeit zu reduzieren.', ['diätpause']),
    term('80/20 Regel', 'tracking', 'Bei dieser Regel isst du etwa 80 Prozent der Woche strukturiert und bleibst 20 Prozent flexibel. So hast du Plan, ohne jeden Ausreißer als Versagen zu sehen.', []),
    term('Meal Prep', 'tracking', 'Meal Prep bedeutet, Essen vorzubereiten, damit gute Entscheidungen leichter werden. Es muss nicht perfekt portioniert sein, schon vorbereitete Basics helfen.', ['vorkochen', 'meal planning']),

    term('Abnehmen', 'weight', 'Abnehmen bedeutet langfristig Körpergewicht zu verlieren. Entscheidend ist meist ein nachhaltiges Kaloriendefizit, nicht die perfekte Diätform.', ['gewichtsverlust']),
    term('Fettverlust', 'weight', 'Fettverlust ist das eigentliche Ziel vieler Diäten. Die Waage zeigt aber auch Wasser, Glykogen, Darminhalt und Muskelmasse.', ['fat loss']),
    term('Plateau', 'weight', 'Ein Plateau ist eine Phase, in der sich Gewicht oder Maße kaum bewegen. Oft helfen Geduld, Wochendurchschnitt prüfen und kleine Anpassungen statt Panik.', ['stillstand']),
    term('Wassereinlagerung', 'weight', 'Wassereinlagerungen können Gewicht kurzfristig erhöhen. Salz, Kohlenhydrate, Stress, Training und Zyklus können dabei eine Rolle spielen.', ['wassergewicht']),
    term('Jojo-Effekt', 'weight', 'Der Jojo Effekt beschreibt erneute Zunahme nach einer Diät. Er entsteht oft durch zu aggressive Diäten und Rückkehr zu alten Gewohnheiten.', ['yoyo']),
    term('Crash Diät', 'weight', 'Eine Crash Diät ist sehr stark eingeschränkt und meist schwer durchzuhalten. Sie kann kurzfristig Gewicht senken, erhöht aber oft Hunger und Rückfallrisiko.', ['crash diet']),
    term('Reverse Diet', 'weight', 'Reverse Diet bedeutet, Kalorien nach einer Diät schrittweise zu erhöhen. Es ist kein Muss, kann aber helfen, wieder Struktur zu finden.', ['reverse dieting']),
    term('Lean Bulk', 'weight', 'Lean Bulk ist ein moderater Kalorienüberschuss für Muskelaufbau mit möglichst wenig Fettzunahme. Er braucht Geduld und eher kleine Überschüsse.', ['sauberer aufbau']),
    term('Mini Cut', 'weight', 'Ein Mini Cut ist eine kurze, geplante Diätphase. Er wird oft genutzt, um im Aufbau etwas Körperfett zu reduzieren.', []),
    term('Metabolic Adaptation', 'weight', 'Metabolic Adaptation beschreibt Anpassungen des Energieverbrauchs während einer Diät. Weniger Körpergewicht, weniger Bewegung und mehr Müdigkeit können den Verbrauch senken.', ['stoffwechselanpassung']),
    term('Defizitgröße', 'weight', 'Defizitgröße beschreibt, wie viele Kalorien du unter deinem Verbrauch isst. Moderat ist oft nachhaltiger als maximal aggressiv.', ['deficit size']),
    term('Zielgewicht', 'weight', 'Zielgewicht ist eine Orientierung, aber nicht alles. Entscheidend sind auch Körpergefühl, Maße, Kraft im Alltag und wie du dich wirklich fühlst.', []),
    term('Bauchfett', 'weight', 'Bauchfett lässt sich nicht gezielt an einer Stelle wegtrainieren. Fettverlust passiert insgesamt, die Reihenfolge ist genetisch unterschiedlich.', ['spot reduction']),
    term('Skinny Fat', 'weight', 'Skinny Fat beschreibt wenig Muskelmasse bei relativ höherem Körperfettanteil. Krafttraining, Protein und Geduld sind hier meist sinnvoller als endloses Hungern.', []),
    term('Körperrekomposition', 'weight', 'Körperrekomposition bedeutet Fett verlieren und Muskeln aufbauen, oft bei ähnlichem Gewicht. Das klappt besonders gut bei Einsteigern, Wiedereinsteigern oder höherem Körperfettanteil.', ['recomp']),
    term('Diätmüdigkeit', 'weight', 'Diätmüdigkeit beschreibt mentale und körperliche Erschöpfung durch lange Einschränkung. Pausen, realistische Ziele und flexible Planung können helfen.', ['diet fatigue']),
    term('Heißhunger', 'weight', 'Heißhunger ist starker Appetit auf bestimmte Lebensmittel. Ein zu großes Defizit, zu strenge Verbote und stressige Ausreißertage können ihn verstärken.', ['cravings']),

    term('BMI', 'body', 'BMI setzt Körpergewicht ins Verhältnis zur Körpergröße. Er ist grob nützlich für Populationen, sagt aber wenig über Muskelmasse oder Fettverteilung aus.', ['body mass index']),
    term('Körperfettanteil', 'body', 'Körperfettanteil beschreibt, welcher Anteil deines Körpergewichts Fettmasse ist. Messungen sind oft ungenau, Trends sind wichtiger als einzelne Werte.', ['kfa', 'body fat']),
    term('Muskelmasse', 'body', 'Muskelmasse ist stoffwechselaktives Gewebe und wichtig für Kraft, Alltag und Körperform. Sie verändert sich langsamer als Wassergewicht.', ['lean mass']),
    term('Wassergewicht', 'body', 'Wassergewicht schwankt täglich und kann mehrere Kilo ausmachen. Es ist einer der Hauptgründe, warum die Waage nicht linear fällt.', ['water weight']),
    term('Zyklus', 'body', 'Der weibliche Zyklus kann Hunger, Energie und die Zahl auf der Waage beeinflussen. Vergleiche deshalb eher Wochentrends statt einzelne Tage miteinander.', ['menstruationszyklus']),

    term('Restaurant', 'habits', 'Restaurantessen ist schwerer exakt zu tracken, weil Öl, Saucen und Portionen variieren. Schätzen, Protein priorisieren und Wochenschnitt denken ist oft praktikabler.', []),
    term('Protein pro Mahlzeit', 'habits', 'Protein über den Tag zu verteilen kann Sättigung und Muskelproteinsynthese unterstützen. Praktisch sind für viele 25 bis 45 g pro Mahlzeit.', []),
    term('Alkohol im Defizit', 'habits', 'Alkohol passt theoretisch in ein Defizit, macht es praktisch aber oft schwerer. Er liefert Kalorien und kann Hunger und Entscheidungen rund ums Essen verschlechtern.', []),
    term('Schrittziel', 'habits', 'Ein Schrittziel ist ein einfacher Rahmen für mehr Bewegung. Es sollte zu deinem Alltag passen und nicht jeden Tag perfekten Zwang erzeugen.', []),
];

export function labelForCategory(category: CategoryId): string {
    return CATEGORY_LABELS[category];
}

export function labelForFilter(filter: FilterId): string {
    return FILTER_OPTIONS.find((option) => option.id === filter)?.label ?? filter;
}

export function categoriesForFilter(filter: FilterId): CategoryId[] {
    return FILTER_OPTIONS.find((option) => option.id === filter)?.categories ?? [];
}
