import { Availability } from "@/lib/types";

export function TalentTags({
  tags,
  availability,
}: {
  tags: string[];
  availability: Availability;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {availability === "immediate" && (
        <span className="text-[13px] px-3 py-1.5 rounded-full bg-blue-50 text-blue-500 font-medium">
          즉시 합류
        </span>
      )}
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[13px] px-3 py-1.5 rounded-full bg-gray-100 text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
