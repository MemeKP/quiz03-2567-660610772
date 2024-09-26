import { DB, readDB, writeDB, Database, Message } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  //get all  messages from roomId
  const roomId = request.nextUrl.searchParams.get('roomId');
  // if (roomId) {
  //   const messages = (<Database>DB).messages.filter(message => message.roomId === roomId);
  //   return NextResponse.json({
  //     ok: true,
  //     messages
  //   })
  // }
  const messages = (<Database>DB).messages.filter(message => message.roomId === roomId);
  if(!roomId){
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  }
    return NextResponse.json({
      ok: true,
      messages
    })
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText} = body;
//   if(!roomId){
//   return NextResponse.json(
//     {
//       ok: false,
//       message: `Room is not found`,
//     },
//     { status: 404 }
//   );
// }

const foundRoomId = (<Database>DB).rooms.find((x) => x.roomId === roomId);
const messageId = nanoid();
if(foundRoomId){
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
if(!foundRoomId){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  // writeDB();

  // return NextResponse.json({
  //   ok: true,
  //   // messageId,
  //   message: "Message has been sent",
  // });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
