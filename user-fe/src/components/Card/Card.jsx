import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// parent Card

const Card = (props) => {
  return (
    <AnimateSharedLayout>
        <CompactCard param={props}  />
    </AnimateSharedLayout>
  );
};
// Compact Card
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
    >
        Iteung

      

    </motion.div>
  );
}

export default Card;
