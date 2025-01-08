"use client";

import { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/issue-card";
import { toast } from "sonner";
import BoardFilters from "./board-filters";

function reorder(list: any, startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

interface SprintBoardProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

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
  assignee: AssigneeProp | null;
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

const SprintBoard = ({
  sprints,
  projectId,
  orgId,
}: {
  sprints: SprintBoardProps[];
  projectId: string;
  orgId: string;
}) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleAddIssue = (status: any) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  // console.log("Issues Array : ", issues);

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint.id]);

  const [filteredIssue, setFilteredissue] = useState(issues);

  const handleFilterChange = (newFilteredIssue: any) => {
    setFilteredissue(newFilteredIssue);
  };

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

  const {
    fn: updateIssueOderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result: any) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update the board!");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update the board after the sprint has ended!");
      return;
    }

    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // @ts-ignore
    const newOrderedData = [...issues];

    // Source and destination lists
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    // If source and ddestination are same
    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card, i) => {
        // @ts-ignore
        card.order = i;
      });
    } else {
      // Remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // Add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // Update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    // setIssues(newOrderedData, sortedIssues);
    setIssues(newOrderedData);

    // Do api call

    updateIssueOderFn(sortedIssues);
  };

  if (issuesError) return <div>Error loading issues!</div>;

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters
          // @ts-ignore
          issues={issues}
          onFilterChange={handleFilterChange}
        />
      )}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}

      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="font-semibold mb-2 text-center">
                      {column.name}
                    </h3>

                    {/* Issues */}

                    {filteredIssue
                      ?.filter((issue) => issue.status === column.key)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssuesLoading ? true : false}
                        >
                          {(provided) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <IssueCard
                                  // @ts-ignore
                                  issue={issue}
                                  showStatus={false}
                                  onDelete={() => fetchIssues(currentSprint.id)}
                                  onUpdate={(updated: any) =>
                                    setIssues((issues) =>
                                      issues?.map((issue) => {
                                        if (issue.id == updated.id)
                                          return updated;
                                        return issue;
                                      })
                                    )
                                  }
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                    {column.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant={"ghost"}
                          className="w-full"
                          onClick={() => handleAddIssue(column.key)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
