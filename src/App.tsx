import { Input } from "./components/ui/input.tsx";
import "./App.css";

function App() {
  return (
    <>
      <div className="flex justify-between m-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
          VideoTube
        </h1>
        <Input className="md:w-1/4 w-2/4 border-2"></Input>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}

export default App;
