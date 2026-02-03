import {
  SignInButton,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>

        <UserButton />
      </SignedIn>
    </div>
  );
}

export default HomePage;
