import { useToast } from "@/6_shared/ui/toast";

const { toast } = useToast();

export const downloadBlob = async (data: Blob, name?: string): Promise<void> => {
  const isJsonBlob = (data: Blob) =>
    data instanceof Blob && data.type === 'application/json';
  const responseData = isJsonBlob(data) ? await data?.text() : data || {};
  try {
    const responseJson =
      typeof responseData === 'string'
        ? JSON.parse(responseData)
        : responseData;
    if ('message' in responseJson) {
        toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: responseJson.message,
          });
      return;
    }
  } catch (e) {}

  const url = window.URL.createObjectURL(
    new Blob([data], {
      type: 'application/octet-stream',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name || '');
  document.body.appendChild(link);
  link.click();
};
