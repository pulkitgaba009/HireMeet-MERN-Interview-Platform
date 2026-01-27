import {
  SignInButton,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
