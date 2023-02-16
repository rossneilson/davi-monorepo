import { FullGovernanceImplementation } from 'stores/types';
import { checkDataSourceAvailability } from './checkDataSourceAvailability';

export const Governance15Implementation: Readonly<FullGovernanceImplementation> =
  {
    name: 'Governance1-5',
    bytecodes: [],
    hooks: {
      fetchers: {
        default: {
          useProposal: null,
          useSnapshotId: null,
          useTotalLocked: null,
          useDAOToken: null,
          useIsProposalCreationAllowed: null,
          useProposalVotesOfVoter: null,
          useVoterLockTimestamp: null,
          useProposalCalls: null,
          useVotingResults: null,
          useVotingPowerOf: null,
          useMemberCount: null,
          useGetPermissions: null,
          useGuildConfig: null,
          useGetVotes: null,
          useGetMemberList: null,
          useGetAllPermissions: null,
          useGetNumberOfActiveProposals: null,
          useGuildProposalIds: null,
        },
        fallback: {
          useProposal: null,
          useSnapshotId: null,
          useTotalLocked: null,
          useDAOToken: null,
          useIsProposalCreationAllowed: null,
          useProposalVotesOfVoter: null,
          useVoterLockTimestamp: null,
          useProposalCalls: null,
          useVotingResults: null,
          useVotingPowerOf: null,
          useMemberCount: null,
          useGetPermissions: null,
          useGuildConfig: null,
          useGetVotes: null,
          useGetMemberList: null,
          useGetAllPermissions: null,
          useGetNumberOfActiveProposals: null,
          useGuildProposalIds: null,
        },
      },
      writers: {
        useApproveTokens: null,
        useCreateProposal: null,
        useExecuteProposal: null,
        useLockTokens: null,
        useVoteOnProposal: null,
        useWithdrawTokens: null,
      },
    },
    capabilities: {
      votingPower: 'soulbound',
      tokenType: 'ERC20',
      consensus: 'holographic',
      votingStyle: 'binary',
      votingPowerTally: 'snapshot',
    },
    checkDataSourceAvailability,
  };
