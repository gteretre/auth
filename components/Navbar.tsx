import React from "react";
import Link from "next/link";
import { KanbanIcon, Pencil, User } from "lucide-react";

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
                    Kanban
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
                <Tooltip text="Nowy" position="left">
                  <Link href="/plan/create">
                    <span>
                      <Pencil />
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip text="Moje plany" position="left">
                  <Link href="/plan">
                    <span>
                      <KanbanIcon />
                    </span>
                  </Link>
                </Tooltip>
                <SignOutButton />
                <Tooltip
                  text={`Profil użytkownika ${session.user.username}`}
                  position="left"
                >
                  <Link href={`/user/${session.user.username}`}>
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
