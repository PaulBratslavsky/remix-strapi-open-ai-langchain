export async function saveDescription(dataToSave: any) {
  const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
  console.log("########## dataToSave ################", dataToSave);
  try {
    const response = await fetch(baseUrl + "/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...dataToSave }),
    });
    const data = await response.json();
    console.log("data", data);
    return { data, message: "saved" };
  } catch (error) {
    console.log("error", error);
  }
  return { data: {}, message: "saved" };
}
