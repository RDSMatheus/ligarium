import { getTemplate } from "@/data/cardDatabase";
import { useCardInfoStore } from "@/store/infoCardStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Swords, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const InfoCard = () => {
  const card = useCardInfoStore((s) => s.card);
  const setCard = useCardInfoStore((s) => s.setCard);
  const template = getTemplate(card ? card.templateId : "");

  if (!template) return null;

  return (
    <Card className="w-50 z-40 pointer-events-auto xl:w-100 relative mx-auto my-3 lg:my-5 xl:my-10 h-100 bg-panel border border-[rgba(200,144,10,0.18)] text-[#FFF3D8] shadow-lg">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-3">
        <div
          className="rounded overflow-hidden"
          style={{ width: 72, height: 84 }}
        >
          {template.image ? (
            <img
              src={`/cards/${template.image}`}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[rgba(0,0,0,0.15)]" />
          )}
        </div>
        <Button onClick={() => setCard(null)}>Close</Button>
        <div>
          <CardTitle
            className="text-xl lg:text-2xl"
            style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
          >
            {template.name}
          </CardTitle>
          <div className="text-lg lg:text-xl xl:text-2xl text-muted-foreground mt-0.5">
            {template.subtype ?? template.type}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto h-25">
        <CardDescription
          className="text-2xl "
          style={{
            fontStyle: "italic",
            fontFamily: "Cinzel,Georgia,serif",
            color: "#FFF3D8",
          }}
        >
          {template.description}
        </CardDescription>

        {template.effects && template.effects.length > 0 && (
          <div className="mt-3">
            {template.effects.map((e, i) => (
              <div key={i} className="text-xl text-muted-foreground mb-1">
                • {e.description}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between absolute bottom-10 text-lg 2xl:text-2xl items-center">
        <div className="flex  items-center gap-2">
          {template.playCost !== undefined && (
            <div
              className="px-2 py-0.5 2xl:px-4 2xl:py-1.5 text-nowrap  rounded bg-[rgba(200,144,10,0.12)] font-semibold"
              style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
            >
              Play {template.playCost}
            </div>
          )}
          {template.evoCost !== undefined && (
            <div
              className="px-2 py-0.5 2xl:px-4 2xl:py-1.5 text-nowrap  rounded bg-[rgba(200,144,10,0.12)]  font-semibold"
              style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
            >
              EVO {template.evoCost}
            </div>
          )}

          {template.ap !== undefined && (
            <div
              className="flex items-center gap-3 px-2 py-0.5 2xl:px-4 2xl:py-1.5 rounded bg-[rgba(200,144,10,0.06)] text-lg xl text-[#FFF3D8]"
              style={{ fontFamily: "Cinzel,Georgia,serif" }}
            >
              <Swords size={24} />
              <span className="font-semibold">{template.ap}</span>
            </div>
          )}

          {template.hp !== undefined && (
            <div
              className="flex items-center gap-3 px-2 py-0.5 2xl:px-4 2xl:py-1.5 rounded bg-[rgba(200,144,10,0.06)] text-[#FFF3D8]"
              style={{ fontFamily: "Cinzel,Georgia,serif" }}
            >
              <span className="font-semibold">
                {card?.currentHp ?? template.hp}
              </span>
              <Heart size={24} />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InfoCard;
