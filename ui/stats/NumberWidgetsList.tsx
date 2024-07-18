import React, { useEffect, useState } from 'react';
import { Grid } from '@chakra-ui/react';
import useApiQuery from 'lib/api/useApiQuery';
import { STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = ['s'];

const NumberWidgetsList = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('stats_counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  if (isError) {
    return <DataFetchAlert />;
  }

  const StatsWidgetData = [...(data?.counters || [])];

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={4}
    >
      {
        StatsWidgetData?.map(({ id, title, value, units, description }, index) => {
          let unitsStr = '';
          if (UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          console.log(id, title, value, units, description)

          return (
            <StatsWidget
              key={id + (isPlaceholderData ? index : '')}
              label={title.replace("ETH", "KONET")}
              value={`${Number(value.replace("ETH", "KONET")).toLocaleString(undefined, { maximumFractionDigits: 3, notation: 'compact' })}${unitsStr.replace("ETH", "KONET")}`}
              isLoading={isPlaceholderData}
              hint={description}
            />
          );
        })
      }
    </Grid>
  );
};

export default NumberWidgetsList;
