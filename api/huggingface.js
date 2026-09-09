export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt é obrigatório" });
  }

  try {
    // Usar variável de ambiente (você coloca no Vercel)
    const hfToken = process.env.HUGGINGFACE_API_KEY;

    if (!hfToken) {
      return res.status(500).json({ error: "API Key não configurada no servidor" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Código para: ${prompt}\n`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Erro na API" });
    }

    if (data && data[0] && data[0].generated_text) {
      return res.status(200).json({
        success: true,
        code: data[0].generated_text.substring(0, 500),
      });
    }

    return res.status(200).json({
      success: true,
      code: "Código gerado!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
