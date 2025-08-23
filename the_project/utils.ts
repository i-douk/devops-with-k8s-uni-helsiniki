export const fetchAndSaveImage = async (localPath: string): Promise<void>  => {
    const response = await fetch("https://picsum.photos/1200");
    
    if (!response.body) {
      throw new Error("Failed to fetch image.");
    }
    const r = response.body?.getReader;
    console.log(r);
    const buf = new Uint8Array(await response.arrayBuffer());
    await Deno.writeFile(`${localPath}`, buf);
    console.log("Image saved successfully.");
  }