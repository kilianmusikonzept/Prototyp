import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeChatMode } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getKnowledgeAnswer = async (question: string, userContext: string, mode: KnowledgeChatMode): Promise<string> => {
  if (!API_KEY) {
    return "Die KI-Funktion ist derzeit nicht verfügbar, da der API-Schlüssel nicht konfiguriert ist.";
  }

  const baseContext = `
Hier sind einige Informationen über den Nutzer, den du berätst. Nutze sie, um deine Antworten zu personalisieren, einfühlsam zu sein und gezielte, beruhigende Ratschläge zu geben. Sprich den Nutzer mit seinem Namen an.
---
NUTZERKONTEXT:
${userContext}
---`;

  const generalRole = `
DEINE GRUNDLEGENDE ROLLE:
Du bist „Prototype – Angst & Panik“, ein evidenzbasierter Assistent für Menschen mit Angst- und Panikbeschwerden.
Dein Ziel ist es, in kurzen, klaren Schritten zu unterstützen – sicher, validierend, ohne Dramatisierung.
Grundsätze:
- Du ersetzt keine Therapie.
- Gib kompakte, praxisnahe Antworten.
- Duze den Nutzer, sei ruhig, sachlich und freundlich.
- Sprich von „Beschwerden/Anzeichen“, stelle keine Diagnosen.
- Verweise am Ende deiner Antwort auf ein passendes praktisches Tool wie 'Atemtraining' oder 'Körperfokus', wenn es thematisch passt.`;

  const quickHelpRole = `
DEINE GRUNDLEGENDE ROLLE:
Du bist „Prototype – Schnelle Hilfe“, ein pragmatischer Coach für Menschen in einer bevorstehenden angstauslösenden Situation.
Dein Ziel ist es, SOFORT umsetzbare, extrem kurze und klare Anweisungen zu geben.
Grundsätze:
- Du ersetzt keine Therapie.
- Sei extrem prägnant. Nutze Stichpunkte oder nummerierte Listen.
- Konzentriere dich auf das, was der Nutzer JETZT SOFORT tun kann.
- Sei ermutigend, direkt und validierend.
- Schließe mit einem Satz ab, der den Nutzer bestärkt (z.B. "Du schaffst das." oder "Konzentriere dich auf den ersten Schritt.").`;
  
  const systemInstruction = mode === 'quick_help' ? (baseContext + quickHelpRole) : (baseContext + generalRole);


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Entschuldigung, bei der Beantwortung deiner Frage ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.";
  }
};

export const getEmergencyResponse = async (userContext: string, followUpMessage?: string): Promise<string> => {
  if (!API_KEY) {
    return "Die KI-Funktion ist derzeit nicht verfügbar.";
  }

  const systemInstruction = `
Du bist Prototype, ein Notfall-Assistent für Panikattacken. Der Nutzer hat GERADE eine Panikattacke. Deine oberste Priorität ist es, Ruhe und Sicherheit zu vermitteln.
Deine Vorgehensweise:
1.  **Bleibe extrem ruhig und validierend.** Sage Sätze wie "Es ist okay, das zu fühlen." oder "Das Gefühl geht vorüber."
2.  **Sei kurz und gib klare, einfache Anweisungen.** Keine langen Texte.
3.  **NUTZE DEN FOLGENDEN KONTEXT**, um die Person direkt mit Namen anzusprechen und gezielt zu beruhigen. Gehe auf 1-2 spezifische Symptome oder ärztliche Befunde aus dem Kontext ein, um Vertrauen zu schaffen und die Angst zu rationalisieren (z.B. "Kilian, ich weiß, du spürst Herzrasen. Denk daran, dein Arzt hat bestätigt, dass dein Herz gesund ist.").
4.  **Leite SOFORT eine einfache Erdungs- oder Atemübung an.** (z.B. 4-4-6 Atmung, 5-4-3-2-1 Technik). Gib die Schritte einzeln und klar an.
---
NUTZERKONTEXT:
${userContext}
---`;
  
  const prompt = followUpMessage || "Ich habe gerade eine Panikattacke. Hilf mir bitte sofort.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for emergency:", error);
    return "Ein Fehler ist aufgetreten. Bitte konzentriere dich auf deine Atmung. Atme langsam ein... und wieder aus. Du schaffst das.";
  }
};

export const analyzeNewSymptoms = async (text: string): Promise<string[]> => {
    if (!API_KEY || !text.trim()) {
        return [];
    }

    const systemInstruction = `Du bist eine KI, die darauf spezialisiert ist, potenzielle physische oder psychologische Angstsymptome aus einem vom Benutzer bereitgestellten Text zu extrahieren. Deine Aufgabe ist es, NUR ein JSON-Array mit Strings zurückzugeben, die die identifizierten Symptome enthalten. Antworte mit einem leeren Array, wenn keine Symptome gefunden werden. Gib keine Erklärungen oder zusätzlichen Text aus.

Beispiel 1:
User-Input: "Ich hatte heute einen seltsamen Druck im Kopf und fühlte mich innerlich sehr unruhig."
Deine Antwort: ["Druck im Kopf", "innere Unruhe"]

Beispiel 2:
User-Input: "Mein Tag war eigentlich ganz gut, aber ich war ein bisschen müde."
Deine Antwort: []
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analysiere den folgenden Text auf Symptome: "${text}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: 'Ein einzelnes identifiziertes Angstsymptom.'
                    }
                }
            },
        });

        const jsonString = response.text;
        const symptoms = JSON.parse(jsonString);
        console.log("Analyzed symptoms:", symptoms);
        return Array.isArray(symptoms) ? symptoms : [];

    } catch (error) {
        console.error("Error analyzing new symptoms with Gemini:", error);
        return []; // Return empty array on error
    }
};
