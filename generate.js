export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt é obrigatório" });
  }

  try {
    // Resposta fake (só pra testar)
    const code = `
// Código gerado para: ${prompt}

function helloWorld() {
  console.log("Olá! Código gerado com sucesso!");
  console.log("Prompt: ${prompt}");
}

helloWorld();
    `;

    return res.status(200).json({
      success: true,
      code: code,
      message: "Código gerado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
