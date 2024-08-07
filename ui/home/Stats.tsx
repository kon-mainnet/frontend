import { Grid } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS, STATS_COUNTER } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';

import StatsItem from './StatsItem';

const hasGasTracker = config.features.gasTracker.isEnabled;
const hasAvgBlockTime = config.UI.homepage.showAvgBlockTime;
const rollupFeature = config.features.rollup;

const Stats = () => {
  const { data, isPlaceholderData, isError, dataUpdatedAt } = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const { data: data2, isPlaceholderData: isPlaceholderData2, isError: isError2 } = useApiQuery('stats_counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  const zkEvmLatestBatchQuery = useApiQuery('homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm',
    },
  });

  if (isError || isError2 || zkEvmLatestBatchQuery.isError) {
    return null;
  }

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  let itemsCount = 6;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  if (data && data2) {
    !data.gas_prices && itemsCount--;
    data.rootstock_locked_btc && itemsCount++;
    const isOdd = Boolean(itemsCount % 2);
    const gasInfoTooltip = hasGasTracker && data.gas_prices ? (
      <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt }>
        <IconSvg
          isLoading={ isPlaceholderData }
          name="info"
          boxSize={ 5 }
          display="block"
          cursor="pointer"
          _hover={{ color: 'link_hovered' }}
          position="absolute"
          top={{ base: 'calc(50% - 12px)', lg: '10px', xl: 'calc(50% - 12px)' }}
          right="10px"
        />
      </GasInfoTooltip>
    ) : null;

    content = (
      <>
        { hasAvgBlockTime && (
          <StatsItem
            icon="clock-light"
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) }s` }
            isLoading={ isPlaceholderData }
          />
        ) }
        <StatsItem
          icon="transactions"
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          url={ route({ pathname: '/txs' }) }
          isLoading={ isPlaceholderData }
        />
        <StatsItem
          icon="wallet"
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ isOdd ? lastItemTouchStyle : undefined }
          isLoading={ isPlaceholderData }
        />
        <StatsItem
          icon="token"
          title="Total burnt"
          value={ Number(data2.counters?.filter(a => a.id === 'totalBurntNativeCoin')[0]?.value).toLocaleString() }
          url={ route({ pathname: '/stats' }) }
          isLoading={ isPlaceholderData2 }
        />
        <StatsItem
          icon="token"
          title="Total circulating"
          value={ Number(data2.counters?.filter(a => a.id === 'totalCirculatingNativeCoin')[0]?.value).toLocaleString() }
          url={ route({ pathname: '/stats' }) }
          isLoading={ isPlaceholderData2 }
        />
        { data.gas_prices && (
          <StatsItem
            icon="gas"
            title="Gas tracker"
            value={ <GasPrice data={ data.gas_prices.average }/> }
            _last={ isOdd ? lastItemTouchStyle : undefined }
            tooltip={ gasInfoTooltip }
            isLoading={ isPlaceholderData }
          />
        ) }
      </>
    );
  }

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(${ itemsCount }, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { content }
    </Grid>

  );
};

export default Stats;
