"use client";

import { useState } from "react";
import SprintManager from "./sprint-manager";

interface SprintBoardProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
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
  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* Kanban Board */}
    </div>
  );
};

export default SprintBoard;
