export const showStatus = (toast, text, type = 'custom_success_toast') => {
  //   toast.hideAll();
  toast.show(text, {
    type,
    data: {
      title: 'Customized toast',
    },
  });
};
