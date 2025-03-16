import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Colors } from "react-native-ui-lib";
import { useDatabase } from "../hooks";

type KHistoryCardProps = {
  roomId: string;
  width?: number;
  height?: number;
};

export const KHistoryCard: React.FC<KHistoryCardProps> = ({ roomId, width, height }) => {
  const { getRoomTotal } = useDatabase();
  const [total, setTotal] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [chartData, setChartData] = useState([
    { value: 30, label: 'Mon' },
    { value: 50, label: 'Tue' },
    { value: 90, label: 'Fri' },
  ]);



  useEffect(() => {
    async function fetchTotal() {
      if (roomId) {
        const amount = await getRoomTotal({ roomId });
        setTotal(amount.total);

        setChartData((prevData) => {
          const newChartData = [
            ...prevData.slice(0, 5),
            { value: amount.total, label: amount.day, frontColor: '#304582' },
          ];

          // Update max value if needed
          const dataMaxValue = Math.max(...newChartData.map(item => item.value));
          if (dataMaxValue > maxValue) {
            setMaxValue(Math.ceil(dataMaxValue / 20) * 20);
          }

          return newChartData;
        });
      }
    }
    fetchTotal();
  }, [roomId]);

  const noOfSections = Math.ceil(maxValue / 20);

  return (
      <BarChart
          data={chartData}
          width={width}
          height={height}
          stepHeight={20}
          stepValue={20}
          barWidth={15}
          roundedTop={true}
          disablePress={true}
          spacing={30}
          frontColor={Colors.lightBlue}
          noOfSections={noOfSections}
          maxValue={maxValue}
          initialSpacing={20}
          xAxisLabelTextStyle={{ color: 'black', fontSize: 12 }}
          rotateLabel={false}
      />
  );
};