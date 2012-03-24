Pf::Application.routes.draw do
  match "/master" => "master#index"
  match "/master/import" => "master#import"
  
  resources :homes do
    collection do
      get "index"
      get "get_classes"
      get 'get_students'
      get 'student_detail'
      post 'student_score'
      get 'student_score'
      get 'comment_student'
      post 'comment_type_tree_nodes'
      get 'commets_by_type'
    end
  end

  resources :settings do
    collection do
      get "index"
      get "classes"
      get "get_course"
      post "destroy_classes"
      post "destroy_course"
      post "ajax_request"
    end
  end

  resources :students do
    collection do
      get "get_all_students"
      get "student_total_score"
      get "print"
      post "destroy_student"
      post "update_student"
      post "update_score"
    end
    member do
      post "update_student_comment"
    end
  end
  
  

  #可切换不同用户列表
  devise_for :users do
    get "logout", :to =>  "devise/sessions#destroy"
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "homes#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
