using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace OeboWebApp.ModelBinders
{
    public class EnumValueModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var modelName = bindingContext.ModelName;
            var value = bindingContext.ValueProvider.GetValue(modelName).FirstValue;

            if (TryParse(bindingContext.ModelType, value, out var parsed))
            {
                bindingContext.Result = ModelBindingResult.Success(parsed);
            }

            return Task.CompletedTask;
        }

        private static bool TryParse(Type enumType, string value, out object result)
        {
            foreach (var name in Enum.GetNames(enumType))
            {
                var attribute = enumType.GetField(name).GetCustomAttribute<EnumMemberAttribute>(false);
                if (attribute.Value == value)
                {
                    result = Enum.Parse(enumType, name);
                    return true;
                }
            }

            result = default;
            return false;
        }
    }
}
