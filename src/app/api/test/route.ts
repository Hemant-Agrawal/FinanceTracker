import { UserColl } from "@/models";
import { NextResponse } from "next/server";

export const GET = async function () {
  
    const user = await UserColl.find();
    return NextResponse.json(user);
  };
