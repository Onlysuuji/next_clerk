type Props = {
    children: React.ReactNode;
};

const AnswerForm = ({
    children
}: Props) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 ">
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default AnswerForm;
