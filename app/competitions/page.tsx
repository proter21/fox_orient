import Link from "next/link";
import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// This would be replaced with your actual data fetching logic
async function getCompetitions() {
  return [
    {
      id: "1",
      name: "Summer Championship",
      date: "2024-07-15",
      time: "09:00",
      location: "Sports Complex",
      entryFee: 25,
      ageGroups: [0, 1, 2],
    },
  ];
}

export default async function CompetitionsPage() {
  const competitions = await getCompetitions();

  return (
    <>
      <MyNavbar />
      <div className="min-h-screen bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-orange-500">Състезания</h1>
            <Link href="/competitions/new">
              <Button variant="outline">Добави състезание</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <CardTitle>{competition.name}</CardTitle>
                  <CardDescription>
                    {new Date(competition.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>Час: {competition.time}</p>
                    <p>Местоположение: {competition.location}</p>
                    <p>Такса за участие: €{competition.entryFee}</p>
                    <p>Възрастови групи: {competition.ageGroups.join(", ")}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Link href={`/competitions/${competition.id}`}>
                    <Button
                      variant="outline"
                      className="hover:bg-orange-500 hover:text-white transition"
                    >
                      Виж детайли
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}
