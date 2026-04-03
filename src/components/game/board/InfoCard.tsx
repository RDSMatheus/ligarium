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

const InfoCard = () => {
  const card = useCardInfoStore((s) => s.card);
  const template = getTemplate(card ? card.templateId : "");

  if (!template) return null;

  return (
    <Card className="max-w-2xl relative mx-auto my-10 h-[calc(100%-40px)] bg-panel border border-[rgba(200,144,10,0.18)] text-[#FFF3D8] shadow-lg">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-3">
        <div
          className="shrink-0 rounded overflow-hidden"
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

        <div>
          <CardTitle
            className="text-4xl"
            style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
          >
            {template.name}
          </CardTitle>
          <div className="text-2xl text-muted-foreground mt-0.5">
            {template.subtype ?? template.tribe ?? template.type}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription
          className="text-2xl"
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

      <CardFooter className="justify-between absolute bottom-10 items-center">
        <div className="flex items-center gap-2">
          {template.playCost !== undefined && (
            <div
              className="px-4 py-1.5 rounded bg-[rgba(200,144,10,0.12)] text-2xl font-semibold"
              style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
            >
              Play {template.playCost}
            </div>
          )}
          {template.evoCost !== undefined && (
            <div
              className="px-4 py-1.5 rounded bg-[rgba(200,144,10,0.12)] text-2xl font-semibold"
              style={{ fontFamily: "Cinzel,Georgia,serif", color: "#FFF3D8" }}
            >
              EVO {template.evoCost}
            </div>
          )}

          {template.ap !== undefined && (
            <div
              className="flex items-center gap-3 px-4 py-1.5 rounded bg-[rgba(200,144,10,0.06)] text-2xl text-[#FFF3D8]"
              style={{ fontFamily: "Cinzel,Georgia,serif" }}
            >
              <Swords size={24} />
              <span className="font-semibold">{template.ap}</span>
            </div>
          )}

          {template.hp !== undefined && (
            <div
              className="flex items-center gap-3 px-4 py-1.5 rounded bg-[rgba(200,144,10,0.06)] text-2xl text-[#FFF3D8]"
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
