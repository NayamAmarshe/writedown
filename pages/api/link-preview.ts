import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = req.query;
    if (!isValidUrl(url as string)) {
      res.status(400).json({ error: 'Invalid URL provided.' });
      return;
    }
    const response = await fetch(url as string);
    const data = await response.text();
    const $ = cheerio.load(data);

    // Site name
    const name = $('meta[property="og:site_name"]').attr("content");

    // Extract title
    const title =
      $("head > title").text() ||
      $('meta[property="og:title"]').attr("content");

    // Extract the description
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content");

    // Extract the image
    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('link[rel="image_src"]').attr("href");

    res.status(200).json({ name, title, description, image });
  } catch (error) {
    res.status(500).json({
      error: JSON.stringify(error),
    });
  }
}
