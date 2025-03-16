import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Colors } from "react-native-ui-lib";
import { useDatabase } from "../hooks";

type KHistoryCardProps = {
  roomId: string;
};

export const KHistoryCard: React.FC<KHistoryCardProps> = ({ roomId }) => {
  const { getRoomTotal } = useDatabase();
  const [total, setTotal] = useState<number>(0);
  const [chartData, setChartData] = useState([
    { value: 30 },
    { value: 50 },
    { value: 20 },
    { value: 90 },
    { value: 45 },
  ]);

  useEffect(() => {
    async function fetchTotal() {
      if (roomId) {
        const amount = await getRoomTotal({ roomId });
        setTotal(amount);

        // Update the chart data with the room total
        setChartData((prevData) => [
          ...prevData.slice(0, 4), // Keep first 4 items
          { value: amount, frontColor: Colors.green }, // Replace last item with room total
        ]);
      }
    }

    fetchTotal();
  }, [roomId]);

  return (
    <BarChart
      data={chartData}
      stepHeight={20}
      stepValue={20}
      barWidth={15}
      roundedTop={true}
      disablePress={true}
      spacing={35}
      frontColor={Colors.darkBlue}
      noOfSections={8}
      initialSpacing={20}
    />
  );
};
