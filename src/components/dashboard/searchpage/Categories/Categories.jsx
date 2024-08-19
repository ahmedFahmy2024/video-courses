"use client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "../CategoryItem/CategoryItem";

const iconMap = {
    "Music": FcMusic,
    "Filming": FcFilmReel,
    "Computer Science": FcMultipleDevices,
    "Fitness": FcSportsMode,
    "Photography": FcOldTimeCamera,
    "Engineering": FcEngineering,
    "Accounting": FcSalesPerformance
}

const Categories = ({ items }) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {
            items.map((item) => (
                <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
            ))
        }
    </div>
  )
};

export default Categories;
