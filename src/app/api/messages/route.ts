import { DB, readDB, writeDB, Database, Message, User, Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  //get all  messages from roomId
  const roomId = request.nextUrl.searchParams.get('roomId');
  const foundRoomId = (<Database>DB).rooms.find((x) => x.roomId === roomId);
  const messages = (<Database>DB).messages.filter(message => message.roomId === roomId);
  if (foundRoomId) {
    return NextResponse.json({
      ok: true,
      messages
    })
  }

  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  };
}
export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body;

  const foundRoomId = (<Database>DB).rooms.find((x) => x.roomId === roomId);
  const messageId = nanoid();
  if (foundRoomId) {
    const message: Message = {
      roomId,
      messageId,
      messageText,
    };
    (<Database>DB).messages.push(message);
    writeDB();
    return NextResponse.json({
      ok: true,
      messageId,
      message: "Message has been sent",
    });
  }
  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  const { role } = <Payload>payload;

  if (role != "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;

  readDB();
  const foundIndex = (<Database>DB).messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  (<Database>DB).messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
