import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has("title");
    const hasContent = searchParams.has("content");
    const hasAuthor = searchParams.has("author");
    const hasProfilePicture = searchParams.has("profilePicture");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "writedown";
    const content = hasContent
      ? searchParams.get("content")?.slice(0, 100)
      : "A free markdown notes app that is simple and beautiful.";
    const author = hasAuthor
      ? searchParams.get("author")?.slice(0, 100)
      : "writedown";
    const profilePicture = hasProfilePicture
      ? searchParams.get("profilePicture")?.slice(0, 100)
      : "https://writedown.app/og-image.png";

    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full truncate items-center justify-center bg-slate-100">
          <div tw="flex flex-col mt-auto">
            <img
              src={profilePicture}
              tw="w-12 mx-auto mb-2 rounded-full"
              alt="Author profile picture"
            />
            <div tw="flex flex-col font-semibold mb-5 text-slate-700 items-center w-11/12 justify-center text-3xl text-center">
              {title}
              <div tw="text-slate-400 mx-auto font-medium text-sm mt-2">
                By {author}
              </div>
            </div>

            <div tw="text-slate-600 mx-auto w-7/12">{content}</div>
          </div>

          <div tw="font-semibold text-slate-500 text-lg mt-auto mb-2">
            writedown.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
