import { UUID } from "crypto";
import { useAAStationsStore } from "./datasource.store";
import { useProjectAction } from "../projects/projects.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSwal } from "../../swal";

export const useCreateDataSource = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      dataSourcePayload
    }: {
      projectUUID: UUID;
      dataSourcePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.schedule.add',
          payload: dataSourcePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Data source added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding data source.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteDataSource = () => {
  const qc =  useQueryClient()
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      dataSourcePayload
    }: {
      projectUUID: UUID;
      dataSourcePayload: {
        repeatKey: string
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.schedule.remove',
          payload: dataSourcePayload,
        },
      });
    },
    
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({queryKey: ['datasources']})
      toast.fire({
        title: 'Data source removed successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing data source.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAAStations = (uuid: UUID) => {
  const q = useProjectAction();
  const { setDhmStations } = useAAStationsStore((state) => ({
    dhmStations: state.dhmStations,
    setDhmStations: state.setDhmStations,
  }));

  const query = useQuery({
    queryKey: ['dhm', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.riverStations.getDhm',
          payload: {}
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setDhmStations({
        [uuid]: query?.data,
      });
    }
  }, [query.data]);
  return query
};

export const useAASources = (uuid: UUID) => {
  const q = useProjectAction();
  // const { setDhmStations } = useAAStationsStore((state) => ({
  //   dhmStations: state.dhmStations,
  //   setDhmStations: state.setDhmStations,
  // }));

  const query = useQuery({
    queryKey: ['datasources', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.schedule.getAll',
          payload: {}
        },
      });
      return mutate.data;
    },
  });

  // useEffect(() => {
  //   if (query.data) {
  //     setDhmStations({
  //       [uuid]: query?.data,
  //     });
  //   }
  // }, [query.data]);
  return query
};
