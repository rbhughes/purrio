interface LayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-purple-200">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          {/* <LogInOut /> */}
          login form
          {/* <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required />
            <button formAction={login}>Log in</button>
          </form> */}
          {/* <Claude /> */}
          <form>
            signout button
            {/* <button formAction={signout}>Sign Out</button> */}
          </form>
        </div>
      </nav>

      <main className="flex flex-grow flex-col gap-6">{children}</main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        footsie
      </footer>
    </div>
  );
};
