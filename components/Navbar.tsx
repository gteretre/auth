import React from "react";
import Link from "next/link";
import { Pencil, User } from "lucide-react";

import Tooltip from "./Tooltip";
import UIMode from "@/components/UIMode";
import { SignInButtons, SignOutButton } from "./AuthButtons";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <header id="header">
      <nav id="navbar" className="bg-inherit">
        <div
          className="mx-auto flex w-full items-center justify-between px-4"
          style={{ maxWidth: "1600px" }}
        >
          <div id="navbar-text" className="flex items-center gap-2">
            <Tooltip text="Panel domowy" position="right">
              <Link href="/">
                <span className="flex items-center gap-2">
                  <span
                    className="pageName"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.5px"
                    }}
                  >
                    Wiadomości
                  </span>
                </span>
              </Link>
            </Tooltip>
            <Tooltip text="Tryb kolorów" position="right">
              <UIMode />
            </Tooltip>
          </div>
          <div id="navbar-text" className="flex items-center gap-2">
            {session && session.user ? (
              <>
                <Tooltip text="Wiadomości" position="left">
                  <Link href="/messages">
                    <span>
                      <Pencil />
                    </span>
                  </Link>
                </Tooltip>
                <SignOutButton />
                <Tooltip text={`Profil`} position="left">
                  <Link href={`/profile`}>
                    <span>
                      <User />
                    </span>
                  </Link>
                </Tooltip>
              </>
            ) : (
              <SignInButtons />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
