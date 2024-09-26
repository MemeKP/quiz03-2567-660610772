import { DB, readDB, writeDB, Database, User } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";


export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms: (<Database>DB).rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  const rawAuthHeader = headers().get("authorization");

  if (!rawAuthHeader || !rawAuthHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        ok: false,
        message: "Authorization header is required",
      },
      { status: 401 }
    );
  }

  const token = rawAuthHeader.split(" ")[1];
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const secret = process.env.JWT_SECRET || "This is my special secret";
  let role = null;
  try {
    const payload = jwt.verify(token, secret);

    //read role information from "payload"
    role = (<User>payload).role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  //check role
  
  if (role == "ADMIN" || role == "SUPER_ADMIN") {
    return NextResponse.json({
      // roomname: ,
    });
  }

  readDB();

  const foundRooms = (<Database>DB).rooms.find((x) => x.roomId === roomId);
  if(foundRooms){
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${foundRooms.roomName} already exists`,
      },
      { status: 400 }
    );
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room ${"replace this with room name"} already exists`,
  //   },
  //   { status: 400 }
  // );

  const roomId = nanoid();

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};
