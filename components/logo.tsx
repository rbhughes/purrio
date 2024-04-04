interface LogoProps {
  variant?:
    | "smHorizontal"
    | "mdHorizontal"
    | "lgHorizontal"
    | "xlHorizontal"
    | "smSquare"
    | "mdSquare"
    | "lgSquare"
    | "xlSquare";
}

export const Logo = ({ variant }: LogoProps) => {
  const smHorizontal = (
    <div className="flex items-center font-PTSerif h-fit w-fit">
      <span className="text-xl text-orange-500 pb-1">&#x25E3;</span>
      <span className="text-xl text-yellow-400 pb-1">&#x25E2;</span>
      <span className="text-xl text-slate-500 font-bold pl-2">purr.io</span>
    </div>
  );
  const mdHorizontal = (
    <div className="flex items-center font-PTSerif h-fit w-fit">
      <span className="text-4xl text-orange-500 pb-2">&#x25E3;</span>
      <span className="text-4xl text-yellow-400 pb-2">&#x25E2;</span>
      <span className="text-4xl text-slate-500 font-bold pl-3">purr.io</span>
    </div>
  );
  const lgHorizontal = (
    <div className="flex items-center font-PTSerif h-fit w-fit">
      <span className="text-6xl text-orange-500 pb-3">&#x25E3;</span>
      <span className="text-6xl text-yellow-400 pb-3">&#x25E2;</span>
      <span className="text-6xl text-slate-500 font-bold pl-4">purr.io</span>
    </div>
  );
  const xlHorizontal = (
    <div className="flex items-center font-PTSerif h-fit w-fit">
      <span className="text-9xl text-orange-500 pb-6">&#x25E3;</span>
      <span className="text-9xl text-yellow-400 pb-6">&#x25E2;</span>
      <span className="text-9xl text-slate-500 font-bold pl-6">purr.io</span>
    </div>
  );

  const smSquare = (
    <div className="flex flex-col items-center font-PTSerif h-fit w-fit pb-1">
      <div>
        <span className="text-xl text-orange-500 ">&#x25E3;</span>
        <span className="text-xl text-yellow-400 ">&#x25E2;</span>
      </div>
      <div className="text-xs text-slate-500 font-bold">purr.io</div>
    </div>
  );

  const mdSquare = (
    <div className="flex flex-col items-center font-PTSerif h-fit w-fit pb-1">
      <div>
        <span className="text-4xl text-orange-500 ">&#x25E3;</span>
        <span className="text-4xl text-yellow-400 ">&#x25E2;</span>
      </div>
      <div className="text-lg text-slate-500 font-bold">purr.io</div>
    </div>
  );

  const lgSquare = (
    <div className="flex flex-col items-center font-PTSerif h-fit w-fit pb-1">
      <div>
        <span className="text-6xl text-orange-500 ">&#x25E3;</span>
        <span className="text-6xl text-yellow-400 ">&#x25E2;</span>
      </div>
      <div className="text-3xl text-slate-500 font-bold">purr.io</div>
    </div>
  );
  const xlSquare = (
    <div className="flex flex-col items-center font-PTSerif h-fit w-fit  pb-2">
      <div>
        <span className="text-9xl text-orange-500 ">&#x25E3;</span>
        <span className="text-9xl text-yellow-400 ">&#x25E2;</span>
      </div>
      <div className="text-6xl text-slate-500 font-bold">purr.io</div>
    </div>
  );

  switch (variant) {
    case "smHorizontal":
      return smHorizontal;
    case "mdHorizontal":
      return mdHorizontal;
    case "lgHorizontal":
      return lgHorizontal;
    case "xlHorizontal":
      return xlHorizontal;

    case "smSquare":
      return smSquare;
    case "mdSquare":
      return mdSquare;
    case "lgSquare":
      return lgSquare;
    case "xlSquare":
      return xlSquare;
    default:
      return mdHorizontal;
  }
};

// <Logo variant="smHorizontal" />
// <Logo variant="smSquare" />

// <Logo variant="mdHorizontal" />
// <Logo variant="mdSquare" />

// <Logo variant="lgHorizontal" />
// <Logo variant="lgSquare" />

// <Logo variant="xlHorizontal" />
// <Logo variant="xlSquare" />
