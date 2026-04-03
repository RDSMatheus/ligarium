import type { Attribute } from "@/data/cardDatabase";

type AttributeType =
  | "Air"
  | "Fire"
  | "Dark"
  | "Electric"
  | "Ice"
  | "Light"
  | "Nature"
  | "Steel"
  | "Water"
  | "Earth";
import Air from "../../../assets/attribute/Air.png";
import Fire from "../../../assets/attribute/Fire.png";
import Ice from "../../../assets/attribute/Ice.png";
import Plant from "../../../assets/attribute/Plant.png";
import Water from "../../../assets/attribute/Water.png";
import Earth from "../../../assets/attribute/Earth.png";
import Light from "../../../assets/attribute/Light.png";
import Steel from "../../../assets/attribute/Steel.png";
import Electric from "../../../assets/attribute/Electric.png";
import Dark from "../../../assets/attribute/Dark.png";

const attributes: Record<AttributeType, string> = {
  Air: Air,
  Fire: Fire,
  Dark: Dark,
  Electric: Electric,
  Ice: Ice,
  Light: Light,
  Nature: Plant,
  Steel: Steel,
  Water: Water,
  Earth: Earth,
};

const AttributeIcon = ({ attribute }: { attribute: AttributeType }) => {
  return (
    <div>
      <img src={attributes[attribute]} alt="" />
    </div>
  );
};

export default AttributeIcon;
