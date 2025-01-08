"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

type AssigneeProp = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  clerkUserId: string;
  email: string;
  imageUrl: string;
};

type ReporterProp = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

enum IssueStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_PREVIEW",
  DONE = "DONE",
}

interface IssueCardProps {
  assignee: AssigneeProp;
  assigneeId: string;
  createdAt: Date;
  description?: string;
  id: string;
  order: number;
  priority: IssuePriority;
  projectId: string;
  reporter: ReporterProp;
  reporterId: string;
  sprintId: string;
  status: IssueStatus;
  title: string;
  updatedAt: Date;
}

const BoardFilters = ({
  issues,
  onFilterChange,
}: {
  issues: IssueCardProps[];
  onFilterChange: (newFilteredIssue: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  const assignees = issues
    .map((issue: IssueCardProps) => issue.assignee)
    .filter(
      // @ts-ignore
      (item, index, self) => index === self.findIndex((t) => t.id == item.id)
    );

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          // @ts-ignore
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignees, selectedPriority, issues]);

  const toggleAssignee = (assigneeId: string) => {
    // @ts-ignore
    setSelectedAssignees((prev) =>
      // @ts-ignore
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  return (
    <div>
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className="w-full sm:w-72"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              // @ts-ignore
              const selected = selectedAssignees.includes(assignee.id);

              return (
                <div
                  key={assignee?.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i,
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageUrl} />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplied && (
          <Button
            variant={"ghost"}
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardFilters;
