# -*- encoding : utf-8 -*-
ProviderSpecApp::Application.routes.draw do
    match ':controller(/:action(/:id(.:format)))'
end
