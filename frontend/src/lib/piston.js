const PISTON_API = "https://emkc.org/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "cpp", version: "10.2.0" },
};

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const res = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `HTTP error! status ${res.status}`,
      };
    }

    const data = await res.json();

    const output = data.run?.output || "";
    const stderr = data.run?.stderr || "";

    if (stderr) {
      return {
        success: false,
        output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No Output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute the code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
  };
  return extensions[language] || "txt";
}
