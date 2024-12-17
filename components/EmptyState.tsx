const EmptyState = () => {
  return (
    <div
      className="
        px-4 
        py-10 
        sm:px-6 
        lg:px-8 
        lg:py-6 
        h-full 
        rounded-r-2xl
        flex 
        justify-center 
        items-center 
        bg-gray-100
      "
    >
      <div className="text-center items-center flex flex-col">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          选择聊天或开始新对话
        </h3>
      </div>
    </div>
  );
}

export default EmptyState;
