export function useNotifications() {
  const { notify } = useNotification()

  function notifyError(title: string = '錯誤', text: string = '發生錯誤') {
    notify({
      title,
      text,
      type: 'error',
    })
  }

  function notifySuccess(title: string = '成功', text: string = '操作成功') {
    notify({
      title,
      text,
      type: 'success',
    })
  }

  function notifyInfo(title: string = '資訊', text: string = '請填寫完所有欄位') {
    notify({
      title,
      text,
      type: 'info',
    })
  }

  function notifyWarn(title: string = '警告', text: string = '請填寫完所有欄位') {
    notify({
      title,
      text,
      type: 'warn',
    })
  }

  return {
    notifyError,
    notifySuccess,
    notifyInfo,
    notifyWarn,
  }
}
