import React, { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import type { LandingPageData } from "../../types/landing";

// --- Components for specific sections ---

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({
  label,
  name,
  type = "text",
  multiline = false,
}: {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
}) => {
  const { register } = useFormContext();
  const Component = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Component
        {...register(name)}
        type={type}
        rows={multiline ? 3 : undefined}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
      />
    </div>
  );
};

const ArrayField = ({
  name,
  label,
  itemLabel,
}: {
  name: string;
  label: string;
  itemLabel?: string;
}) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`${name}.${index}`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              placeholder={`${itemLabel || "Item"} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Добавить элемент
        </button>
      </div>
    </div>
  );
};

const ObjectArrayField = ({
  name,
  label,
  renderItem,
}: {
  name: string;
  label: string;
  renderItem: (index: number) => React.ReactNode;
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-lg font-medium text-gray-900">
          {label}
        </label>
        <button
          type="button"
          onClick={() => append({})}
          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium"
        >
          + Добавить {label}
        </button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              title="Удалить"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="pr-8">{renderItem(index)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const methods = useForm<LandingPageData>();
  const { reset, handleSubmit, register } = methods;

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        reset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: LandingPageData) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Сохранено успешно!" });
    } catch (err) {
      setMessage({ type: "error", text: "Ошибка при сохранении" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Загрузка данных...</div>
    );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto py-10 px-4"
      >
        <div className="flex justify-between items-center mb-8 sticky top-20 bg-gray-50/95 backdrop-blur py-4 z-10 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Редактирование Контента
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Выйти
            </button>
            {message && (
              <span
                className={`text-sm px-3 py-1 rounded-full ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {message.text}
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
        {/* --- Header --- */}
        <SectionCard title="Шапка (Header)">
          <InputField label="Телефон" name="header.phone" />
          <InputField label="Ссылка телефона (tel:)" name="header.phoneHref" />
          <InputField label="Текст кнопки" name="header.ctaButton" />
          <ObjectArrayField
            name="header.nav"
            label="Меню навигации"
            renderItem={(index) => (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Название"
                  name={`header.nav.${index}.label`}
                />
                <InputField label="Ссылка" name={`header.nav.${index}.href`} />
              </div>
            )}
          />
        </SectionCard>
        {/* --- Hero --- */}
        <SectionCard title="Главный экран (Hero)">
          <InputField label="Заголовок" name="hero.title" multiline />
          <InputField label="Подзаголовок" name="hero.subtitle" multiline />
          <InputField label="Текст кнопки" name="hero.ctaButton" />
          <ArrayField
            name="hero.benefits"
            label="Преимущества (список)"
            itemLabel="Пункт"
          />
        </SectionCard>
        {/* --- Services --- */}
        <SectionCard title="Услуги (Services)">
          <InputField label="Заголовок секции" name="services.title" />
          <ObjectArrayField
            name="services.items"
            label="Список услуг"
            renderItem={(index) => (
              <div className="space-y-4">
                <InputField
                  label="Название"
                  name={`services.items.${index}.title`}
                />
                <InputField
                  label="Описание"
                  name={`services.items.${index}.description`}
                  multiline
                />
                <div className="text-xs text-gray-500">
                  Иконка: {methods.getValues(`services.items.${index}.icon`)}{" "}
                  (изменению не подлежит)
                </div>
              </div>
            )}
          />
        </SectionCard>
        {/* --- Cases --- */}
        <SectionCard title="Кейсы (Cases)">
          <InputField label="Заголовок секции" name="cases.title" />
          <InputField label="Подзаголовок" name="cases.subtitle" />
          <ObjectArrayField
            name="cases.items"
            label="Проекты"
            renderItem={(index) => (
              <div className="space-y-4">
                <InputField
                  label="Название"
                  name={`cases.items.${index}.title`}
                />
                <InputField
                  label="Описание"
                  name={`cases.items.${index}.description`}
                  multiline
                />
                <InputField
                  label="URL картинки (необязательно)"
                  name={`cases.items.${index}.image`}
                />
                <ArrayField
                  name={`cases.items.${index}.tags`}
                  label="Теги"
                  itemLabel="Тег"
                />
              </div>
            )}
          />
        </SectionCard>
        {/* --- Benefits --- */}
        <SectionCard title="Преимущества (Why Us)">
          <InputField label="Заголовок секции" name="benefits.title" />
          <ObjectArrayField
            name="benefits.items"
            label="Пункты"
            renderItem={(index) => (
              <div className="space-y-4">
                <InputField
                  label="Название"
                  name={`benefits.items.${index}.title`}
                />
                <InputField
                  label="Описание"
                  name={`benefits.items.${index}.description`}
                  multiline
                />
              </div>
            )}
          />
        </SectionCard>
        {/* --- Contact Form --- */}
        <SectionCard title="Форма контактов">
          <InputField label="Заголовок" name="contactForm.title" />
          <InputField label="Подзаголовок" name="contactForm.subtitle" />
        </SectionCard>
        {/* --- About / Contacts --- */}
        <SectionCard title="Контакты (About)">
          <InputField label="Заголовок" name="about.title" />
          <InputField label="Подзаголовок" name="about.subtitle" />
          <InputField label="Адрес" name="about.address" />
          <InputField label="Телефон" name="about.phone" />
          <InputField label="Email" name="about.email" />
          <InputField label="Часы работы" name="about.workingHours" />
          <InputField
            label="Ссылка на карту (embed)"
            name="about.mapEmbedUrl"
          />
        </SectionCard>
        {/* --- Footer --- */}
        <SectionCard title="Подвал (Footer)">
          <InputField label="Слоган" name="footer.slogan" />
          <InputField label="Копирайт" name="footer.copyright" />
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">
              Юридическая информация
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Название юр. лица" name="footer.legal.name" />
              <InputField label="ИНН" name="footer.legal.inn" />
              <InputField label="КПП" name="footer.legal.kpp" />
              <InputField label="ОГРН" name="footer.legal.ogrn" />
              <InputField
                label="Ссылка на Политику"
                name="footer.legal.privacyPolicy"
              />
              <InputField
                label="Ссылка на Соглашение"
                name="footer.legal.userAgreement"
              />
            </div>
          </div>
        </SectionCard>
        <div className="h-20"></div> {/* Spacer */}
      </form>
    </FormProvider>
  );
}
