import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechToTextOptions {
  /** Called every time the recognized transcript changes (interim + final). */
  onTranscriptChange?: (fullTranscript: string, isFinal: boolean) => void;
  lang?: string;
}

interface UseSpeechToTextResult {
  isSupported: boolean;
  isListening: boolean;
  interimText: string;
  error: string;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

interface SpeechRecognitionResultItem {
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognitionEvent {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  readonly error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

interface WindowWithSpeechRecognition {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

/**
 * Wraps window.SpeechRecognition / webkitSpeechRecognition to provide
 * live speech-to-text. Purely additive — never blocks manual typing.
 */
export function useSpeechToText(
  options: UseSpeechToTextOptions = {}
): UseSpeechToTextResult {
  const { onTranscriptChange, lang = "en-US" } = options;

  const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
    typeof window !== "undefined"
      ? (window as unknown as WindowWithSpeechRecognition).SpeechRecognition ||
        (window as unknown as WindowWithSpeechRecognition).webkitSpeechRecognition
      : undefined;

  const isSupported = !!SpeechRecognitionCtor;

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupported || !SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalChunk += transcript;
        } else {
          interimChunk += transcript;
        }
      }

      if (finalChunk) {
        onTranscriptChange?.(finalChunk, true);
        setInterimText("");
      }

      if (interimChunk) {
        setInterimText(interimChunk);
        onTranscriptChange?.(interimChunk, false);
      }
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      setError(
        event.error === "not-allowed"
          ? "Microphone access was denied."
          : "Voice input error. Please try again."
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setError("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() throws if already started — ignore
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, interimText, error, start, stop, toggle };
}
